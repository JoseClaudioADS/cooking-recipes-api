import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Category } from "../../core/recipes/entity/category";
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
  private readonly DEFAULT_PAGE_SIZE = 15;
  private readonly DEFAULT_PAGE = 1;

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
    const {
      categoryId,
      q,
      sortBy,
      page = this.DEFAULT_PAGE,
      size = this.DEFAULT_PAGE_SIZE,
    } = searchRecipeInput;

    const conditions = [];

    if (categoryId) {
      conditions.push(eq(recipeAlias.categoryId, categoryId));
    }

    if (q) {
      conditions.push(
        or(
          ilike(recipeAlias.title, `%${q}%`),
          ilike(recipeAlias.description, `%${q}%`),
        ),
      );
    }

    let sortClause = desc(recipeAlias.createdAt);

    switch (sortBy) {
      case "most-loved":
        // sortClause = desc(recipeAlias.likes);
        break;
      case "most-recents":
        sortClause = desc(recipeAlias.createdAt);
        break;
      default:
        break;
    }

    const total = await this.db
      .select({ total: count() })
      .from(recipeAlias)
      .innerJoin(userAlias, eq(recipeAlias.userId, userAlias.id))
      .innerJoin(photoAlias, eq(recipeAlias.photoId, photoAlias.id))
      .innerJoin(categoryAlias, eq(recipeAlias.categoryId, categoryAlias.id))
      .where(and(...conditions));

    const result = await this.db
      .select()
      .from(recipeAlias)
      .innerJoin(userAlias, eq(recipeAlias.userId, userAlias.id))
      .innerJoin(photoAlias, eq(recipeAlias.photoId, photoAlias.id))
      .innerJoin(categoryAlias, eq(recipeAlias.categoryId, categoryAlias.id))
      .where(and(...conditions))
      .limit(size)
      .offset((page - 1) * size)
      .orderBy(sortClause);

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

  async getCategories(): Promise<Category[]> {
    return this.db.query.categoriesTable.findMany({
      orderBy: [asc(schema.categoriesTable.name)],
    });
  }
}
