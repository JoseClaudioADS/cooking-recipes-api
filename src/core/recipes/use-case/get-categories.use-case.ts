import { Category } from "../entity/category";
import { RecipesRepository } from "../repository/recipes.repository";

/**
 *
 */
export class GetCategoriesUseCase {
  constructor(private readonly recipesRepository: RecipesRepository) {}

  async execute(): Promise<Category[]> {
    return this.recipesRepository.getCategories();
  }
}
