import * as z from "zod";
import { RecipesRepository } from "../repository/recipes.repository";

const searchRecipesSchema = z.object({
    title: z.string().optional()
});

export type SearchRecipesInput = z.infer<typeof searchRecipesSchema>;

/**
 *
 */
export class SearchRecipesUseCase {

    constructor(private readonly recipesRepository: RecipesRepository) {}

    async execute(searchRecipesInput: SearchRecipesInput): Promise<void> {
        searchRecipesSchema.parse(searchRecipesInput);

        const result = await this.recipesRepository.search({});

        console.log(result);

    }
}
