import { and, count, eq, ilike } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
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
import { recipeIngredientsTable, recipesTable } from "../db/drizzle-db-schema";
import {
  categoryAlias,
  photoAlias,
  recipeAlias,
  userAlias,
} from "./drizzle-helper";

/**
 *
 */
export class DrizzleRecipesRepository implements RecipesRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

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

    const conditions = [];

    if (title) {
      conditions.push(ilike(recipeAlias.title, `%${title}%`));
    }

    const total = await this.db
      .select({ total: count() })
      .from(recipesTable)
      .where(and(...conditions));

    const result = await this.db
      .select()
      .from(recipeAlias)
      .innerJoin(userAlias, eq(recipeAlias.userId, userAlias.id))
      .innerJoin(photoAlias, eq(recipeAlias.photoId, photoAlias.id))
      .innerJoin(categoryAlias, eq(recipeAlias.categoryId, categoryAlias.id))
      .where(and(...conditions));

    if (result.length === 0) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: total[0].total,
      items: result.map((r) => {
        const { recipe, user, photo, category } = r;

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
