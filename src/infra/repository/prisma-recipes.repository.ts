import { PrismaClient } from "@prisma/client";
import { RecipesRepository } from "../../core/recipes/repository/recipes.repository";
import { CreateRecipeRepositoryInput, CreateRecipeRepositoryOutput } from "../../core/recipes/repository/types/create-recipe.repository.type";

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
}
