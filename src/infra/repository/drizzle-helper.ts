import { alias } from "drizzle-orm/pg-core";
import * as schema from "../db/drizzle-db-schema";

export const recipeAlias = alias(schema.recipesTable, "recipe");
export const userAlias = alias(schema.usersTable, "user");
export const photoAlias = alias(schema.photosTable, "photo");
export const categoryAlias = alias(schema.categoriesTable, "category");
