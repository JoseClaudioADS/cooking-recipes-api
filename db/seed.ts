import { faker } from "@faker-js/faker";
import "dotenv/config";
import { db } from "../src/infra/db/drizzle-db";
import {
  categoriesTable,
  magicLinksTable,
  photosTable,
  recipeIngredientsTable,
  recipesTable,
  usersTable,
} from "../src/infra/db/drizzle-db-schema";
import { DrizzleRecipesRepository } from "../src/infra/repository/drizzle-recipes.repository";
import env from "../src/utils/env";

/**
 * Seed database for test purposes
 * @returns {Promise<void>}
 */
async function seed() {
  if (env.NODE_ENV === "production") {
    return;
  }

  await db.delete(recipeIngredientsTable);
  await db.delete(recipesTable);
  await db.delete(photosTable);
  await db.delete(magicLinksTable);
  await db.delete(usersTable);
  await db.delete(categoriesTable);

  const user = await db
    .insert(usersTable)
    .values({
      name: "Jose Claudio",
      email: "joseclaudio@email.com",
      bio: "Example bio",
    })
    .returning();

  const categorieNames = [
    "Aves",
    "Carnes",
    "Peixes",
    "Sobremesas",
    "Veganas",
    "Vegetarianas",
  ]; // 🇧🇷

  const categories = await db
    .insert(categoriesTable)
    .values(categorieNames.map((name) => ({ name })))
    .returning();

  const photo = await db
    .insert(photosTable)
    .values({
      filename: "photo.png",
    })
    .returning();

  const recipesRepository = new DrizzleRecipesRepository(db);

  for (let i = 0; i < 50; i++) {
    await recipesRepository.create({
      categoryId:
        categories[faker.number.int({ min: 0, max: categorieNames.length - 1 })]
          .id,
      ingredients: [
        {
          name: faker.lorem.word(),
          quantity: faker.lorem.word(),
        },
        {
          name: faker.lorem.word(),
          quantity: faker.lorem.word(),
        },
      ],
      preparationTime: faker.number.int({ min: 1, max: 100 }),
      photoId: photo[0].id,
      steps: faker.lorem.paragraph(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      userId: user[0].id,
    });
  }

  process.exit(0);
}

seed();
