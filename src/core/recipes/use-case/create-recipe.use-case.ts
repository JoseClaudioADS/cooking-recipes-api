import * as z from "zod";
import { RecipesRepository } from "../repository/recipes.repository";

const createRecipeSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  preparationTime: z.number().min(1),
  ingredients: z.array(z.object({
    name: z.string().min(2),
    quantity: z.string().min(1)
  })),
  photoId: z.number().min(1),
  userId: z.number().min(1),
  categoryId: z.number().min(1)
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

/**
 *
 */
export class CreateRecipeUseCase {

  constructor(private readonly recipesRepository: RecipesRepository) { }

  async execute(createRecipeInput: CreateRecipeInput): Promise<void> {

    const { title, description, photoId, preparationTime, ingredients, userId, categoryId } =
      createRecipeSchema.parse(createRecipeInput);

    await this.recipesRepository.create(
      { title, description, photoId, preparationTime, ingredients, userId, categoryId }
    );
  }
}
