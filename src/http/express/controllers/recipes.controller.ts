import { Request, Response } from "express";
import { RecipesRepository } from "../../../core/recipes/repository/recipes.repository";
import { CreateRecipeUseCase } from "../../../core/recipes/use-case/create-recipe.use-case";

/**
 *
 */
export class RecipesController {

    private readonly createRecipeUseCase: CreateRecipeUseCase;

    constructor(readonly recipesRepository: RecipesRepository) {
        this.createRecipeUseCase = new CreateRecipeUseCase(recipesRepository);
    }

    async create(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id;

        await this.createRecipeUseCase.execute({
            ...req.body,
            userId
        });

        res.sendStatus(201);
    }
}
