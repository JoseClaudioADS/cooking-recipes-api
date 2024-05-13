import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    bio: varchar("bio", { length: 256 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (definedUsersTable) => {
    return {
      emailIndex: uniqueIndex("email_idx").on(definedUsersTable.email),
    };
  },
);

export const magicLinksTable = pgTable("magic_links", {
  token: varchar("token", { length: 256 }).primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: serial("user_id").references(() => usersTable.id),
});

export const photosTable = pgTable(
  "photos",
  {
    id: serial("id").primaryKey(),
    filename: varchar("filename", { length: 256 }).notNull(),
  },
  (definedPhotosTable) => {
    return {
      filenameIndex: uniqueIndex("filename_idx").on(
        definedPhotosTable.filename,
      ),
    };
  },
);

export const categoriesTable = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
  },
  (definedCategoriesTable) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(definedCategoriesTable.name),
    };
  },
);

export const recipesTable = pgTable(
  "recipes",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    preparationTime: integer("preparation_time").notNull(),
    steps: text("steps").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    userId: serial("user_id").references(() => usersTable.id),
    photoId: serial("photo_id").references(() => photosTable.id),
    categoryId: serial("category_id").references(() => categoriesTable.id),
  },
  (definedRecipesTable) => {
    return {
      titleIndex: uniqueIndex("title_idx").on(definedRecipesTable.title),
    };
  },
);

export const recipeIngredientsTable = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  quantity: varchar("ingredient", { length: 40 }),
  name: varchar("name", { length: 256 }).notNull(),
  recipeId: serial("recipe_id").references(() => recipesTable.id),
});

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  magicLink: one(magicLinksTable, {
    fields: [usersTable.id],
    references: [magicLinksTable.userId],
  }),
  recipes: many(recipesTable),
}));

export const recipesRelations = relations(recipesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [recipesTable.userId],
    references: [usersTable.id],
  }),
  category: one(categoriesTable, {
    fields: [recipesTable.categoryId],
    references: [categoriesTable.id],
  }),
  photo: one(recipesTable, {
    fields: [recipesTable.photoId],
    references: [recipesTable.id],
  }),
  ingredients: many(recipeIngredientsTable),
}));

export const recipeIngredientsRelations = relations(
  recipeIngredientsTable,
  ({ one }) => ({
    recipe: one(recipesTable, {
      fields: [recipeIngredientsTable.recipeId],
      references: [recipesTable.id],
    }),
  }),
);
