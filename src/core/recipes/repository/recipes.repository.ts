import { CreateRecipeRepositoryInput, CreateRecipeRepositoryOutput } from "./types/create-recipe.repository.type";
import { SearchRecipesRepositoryInput, SearchRecipesRepositoryOutput } from "./types/search-recipes.repository.type";

export interface RecipesRepository {
  create(createRecipeInput: CreateRecipeRepositoryInput): Promise<CreateRecipeRepositoryOutput>;

  search(searchRecipeInput: SearchRecipesRepositoryInput): Promise<SearchRecipesRepositoryOutput>;
}
