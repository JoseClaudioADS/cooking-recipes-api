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

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    bio: varchar("bio", { length: 256 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (usersTable) => {
    return {
      emailIndex: uniqueIndex("email_idx").on(usersTable.email),
    };
  },
);

export const magicLinks = pgTable("magic_links", {
  token: varchar("token", { length: 256 }).primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: serial("user_id").references(() => users.id),
});

export const photos = pgTable(
  "photos",
  {
    id: serial("id").primaryKey(),
    filename: varchar("filename", { length: 256 }).notNull(),
  },
  (photosTable) => {
    return {
      filenameIndex: uniqueIndex("filename_idx").on(photosTable.filename),
    };
  },
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
  },
  (categoriesTable) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(categoriesTable.name),
    };
  },
);

export const recipes = pgTable(
  "recipes",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    preparationTime: integer("preparation_time").notNull(),
    steps: text("steps").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    userId: serial("user_id").references(() => users.id),
    photoId: serial("photo_id").references(() => photos.id),
    categoryId: serial("category_id").references(() => categories.id),
  },
  (recipesTable) => {
    return {
      titleIndex: uniqueIndex("title_idx").on(recipesTable.title),
    };
  },
);

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  quantity: varchar("ingredient", { length: 40 }),
  name: varchar("name", { length: 256 }).notNull(),
  recipeId: serial("recipe_id").references(() => recipes.id),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  magicLink: one(magicLinks, {
    fields: [users.id],
    references: [magicLinks.userId],
  }),
  recipes: many(recipes),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [recipes.categoryId],
    references: [categories.id],
  }),
  photo: one(recipes, {
    fields: [recipes.photoId],
    references: [recipes.id],
  }),
  ingredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
  }),
);
