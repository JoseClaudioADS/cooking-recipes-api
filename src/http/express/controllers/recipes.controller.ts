import { Request, Response } from "express";
import { RecipesRepository } from "../../../core/recipes/repository/recipes.repository";
import { CreateRecipeUseCase } from "../../../core/recipes/use-case/create-recipe.use-case";
import { SearchRecipesUseCase } from "../../../core/recipes/use-case/search-recipes.use-case";
import { UploadService } from "../../../core/shared/services/upload.service";

/**
 *
 */
export class RecipesController {

  private readonly createRecipeUseCase: CreateRecipeUseCase;
  private readonly searchRecipesUseCase: SearchRecipesUseCase;

  constructor(readonly recipesRepository: RecipesRepository, readonly uploadService: UploadService) {
    this.createRecipeUseCase = new CreateRecipeUseCase(recipesRepository);
    this.searchRecipesUseCase = new SearchRecipesUseCase(recipesRepository, uploadService);
  }

  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    await this.createRecipeUseCase.execute({
      ...req.body,
      userId
    });

    res.sendStatus(201);
  }

  async search(req: Request, res: Response): Promise<void> {

    const result = await this.searchRecipesUseCase.execute(req.query);

    res.json(result);
  }
}
