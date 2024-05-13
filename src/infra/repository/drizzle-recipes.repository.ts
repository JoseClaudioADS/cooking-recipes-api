import { count, eq, ilike } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { RecipesRepository } from "../../core/recipes/repository/recipes.repository";
import {
  CreateRecipeRepositoryInput,
  CreateRecipeRepositoryOutput,
} from "../../core/recipes/repository/types/create-recipe.repository.type";
import {
  SearchRecipesRepositoryInput,
  SearchRecipesRepositoryOutput,
} from "../../core/recipes/repository/types/search-recipes.repository.type";
import * as schema from "../db/drizzle-db-schema";
import {
  categoriesTable,
  photosTable,
  recipeIngredientsTable,
  recipesTable,
  usersTable,
} from "../db/drizzle-db-schema";

/**
 *
 */
export class DrizzleRecipesRepository implements RecipesRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(
    createRecipeInput: CreateRecipeRepositoryInput,
  ): Promise<CreateRecipeRepositoryOutput> {
    const {
      title,
      description,
      steps,
      preparationTime,
      ingredients,
      photoId,
      userId,
      categoryId,
    } = createRecipeInput;

    return this.db.transaction(async (tx) => {
      const recipeInsertResult = await tx
        .insert(recipesTable)
        .values({
          title,
          description,
          preparationTime,
          steps,
          photoId,
          userId,
          categoryId,
        })
        .returning({ id: recipesTable.id });

      const recipeId = recipeInsertResult[0].id;

      const mappedIngredients = ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        recipeId,
      }));

      await tx.insert(recipeIngredientsTable).values(mappedIngredients);

      return { id: recipeId };
    });
  }

  async search(
    searchRecipeInput: SearchRecipesRepositoryInput,
  ): Promise<SearchRecipesRepositoryOutput> {
    const { title } = searchRecipeInput;

    const total = await this.db
      .select({ total: count() })
      .from(recipesTable)
      .where(ilike(recipesTable.title, `%${title}%`));

    const result = await this.db
      .select()
      .from(recipesTable)
      .innerJoin(usersTable, eq(recipesTable.userId, usersTable.id))
      .innerJoin(photosTable, eq(recipesTable.photoId, photosTable.id))
      .innerJoin(
        categoriesTable,
        eq(recipesTable.categoryId, categoriesTable.id),
      )
      .where(ilike(recipesTable.title, `%${title}%`));

    if (result.length === 0) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: total[0].total,
      items: result.map((r) => {
        const recipe = r.recipes; // TODO improve relation names
        const user = r.users;
        const photo = r.photos;
        const category = r.categories;

        return {
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          steps: recipe.steps,
          preparationTime: recipe.preparationTime,
          user: {
            id: user.id,
            name: user.name,
          },
          photo: {
            id: photo.id,
            filename: photo.filename,
          },
          category: {
            id: category.id,
            name: category.name,
          },
          createdAt: recipe.createdAt,
          updatedAt: recipe.updatedAt,
        };
      }),
    };
  }
}
