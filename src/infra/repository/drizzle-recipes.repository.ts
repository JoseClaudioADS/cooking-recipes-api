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
  categories,
  photos,
  recipeIngredients,
  recipes,
  users,
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
        .insert(recipes)
        .values({
          title,
          description,
          preparationTime,
          steps,
          photoId,
          userId,
          categoryId,
        })
        .returning({ id: recipes.id });

      const recipeId = recipeInsertResult[0].id;

      const mappedIngredients = ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        recipeId,
      }));

      await tx.insert(recipeIngredients).values(mappedIngredients);

      return { id: recipeId };
    });
  }

  async search(
    searchRecipeInput: SearchRecipesRepositoryInput,
  ): Promise<SearchRecipesRepositoryOutput> {
    const { title } = searchRecipeInput;

    const total = await this.db
      .select({ total: count() })
      .from(recipes)
      .where(ilike(recipes.title, `%${title}%`));

    const result = await this.db
      .select()
      .from(recipes)
      .innerJoin(users, eq(recipes.userId, users.id))
      .innerJoin(photos, eq(recipes.photoId, photos.id))
      .innerJoin(categories, eq(recipes.categoryId, categories.id))
      .where(ilike(recipes.title, `%${title}%`));

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
