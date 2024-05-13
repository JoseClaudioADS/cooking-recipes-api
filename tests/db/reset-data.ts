import { db } from "../../src/infra/db/drizzle-db";
import {
  categoriesTable,
  magicLinksTable,
  photosTable,
  recipeIngredientsTable,
  recipesTable,
  usersTable,
} from "../../src/infra/db/drizzle-db-schema";

export const resetData = async () => {
  await db.delete(recipeIngredientsTable);
  await db.delete(recipesTable);
  await db.delete(photosTable);
  await db.delete(magicLinksTable);
  await db.delete(usersTable);
  await db.delete(categoriesTable);
};

export default resetData;
