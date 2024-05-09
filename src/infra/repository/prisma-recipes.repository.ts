import { PrismaClient } from "@prisma/client";
import { RecipesRepository } from "../../core/recipes/repository/recipes.repository";
import { CreateRecipeRepositoryInput, CreateRecipeRepositoryOutput } from "../../core/recipes/repository/types/create-recipe.repository.type";
import { SearchRecipesRepositoryInput, SearchRecipesRepositoryOutput } from "../../core/recipes/repository/types/search-recipes.repository.type";
import { parseUser } from "./parsers/prisma-user.parser";

/**
 *
 */
export class PrismaRecipesRepository implements RecipesRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async create(createRecipeInput: CreateRecipeRepositoryInput): Promise<CreateRecipeRepositoryOutput> {

        const { title, description, preparationTime, ingredients, photoId, userId } = createRecipeInput;

        const recipe = await this.prisma.recipe.create({
            data: {
                title,
                description,
                preparationTime,
                ingredients: {
                    create: ingredients
                },
                photo: {
                    connect: {
                        id: photoId
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });

        return {
            id: recipe.id
        };
    }

    async search(searchRecipeInput: SearchRecipesRepositoryInput): Promise<SearchRecipesRepositoryOutput> {

        const { title } = searchRecipeInput;

        const total = await this.prisma.recipe.count({
            where: {
                title: {
                    contains: title
                }
            }
        });

        const recipes = await this.prisma.recipe.findMany({
            include: {
                photo: true,
                ingredients: true,
                user: true
            },
            where: {
                title: {
                    contains: title
                }
            }
        });

        return {
            total,
            items: recipes.map(recipe => ({
                id: recipe.id,
                title: recipe.title,
                description: recipe.description,
                preparationTime: recipe.preparationTime,
                ingredients: recipe.ingredients.map(ingredient => ({
                    id: ingredient.id,
                    name: ingredient.name,
                    quantity: ingredient.quantity
                })),
                photo: {
                    id: recipe.photo?.id as number,
                    filename: recipe.photo?.filename as string
                },
                user: parseUser(recipe.user),
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt
            }))
        };
    }
}
