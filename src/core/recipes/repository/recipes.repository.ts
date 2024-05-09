import { CreateRecipeRepositoryInput, CreateRecipeRepositoryOutput } from "./types/create-recipe.repository.type";

export interface RecipesRepository {
  create(createRecipeInput: CreateRecipeRepositoryInput): Promise<CreateRecipeRepositoryOutput>;
}
