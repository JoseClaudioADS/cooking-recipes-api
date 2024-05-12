import * as z from "zod";
import { UploadService } from "../../shared/services/upload.service";
import { RecipesRepository } from "../repository/recipes.repository";

const searchRecipesSchema = z.object({
  title: z.string().optional(),
});

export type SearchRecipesInput = z.infer<typeof searchRecipesSchema>;

export type SearchRecipesOutput = {
  total: number;
  items: {
    id: number;
    title: string;
    description: string | null;
    steps: string;
    preparationTime: number;
    photoUrl: string;
    user: {
      id: number;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }[];
};

/**
 *
 */
export class SearchRecipesUseCase {
  constructor(
    private readonly recipesRepository: RecipesRepository,
    private readonly uploadService: UploadService,
  ) {}

  async execute(
    searchRecipesInput: SearchRecipesInput,
  ): Promise<SearchRecipesOutput> {
    searchRecipesSchema.parse(searchRecipesInput);

    const result = await this.recipesRepository.search({});

    const mappedResult = result.items.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      steps: recipe.steps,
      preparationTime: recipe.preparationTime,
      photoUrl: this.uploadService.getUrl(recipe.photo.filename),
      user: {
        id: recipe.user.id,
        name: recipe.user.name,
      },
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    }));

    return {
      total: result.total,
      items: mappedResult,
    };
  }
}
