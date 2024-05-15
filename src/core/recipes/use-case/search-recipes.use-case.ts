import * as z from "zod";
import { UploadService } from "../../shared/services/upload.service";
import { Category } from "../entity/category";
import { RecipesRepository } from "../repository/recipes.repository";

const searchRecipesSchema = z.object({
  title: z.string().optional(),
  categoryId: z
    .string()
    .optional()
    .transform((categoryId) => Number(categoryId) || void 0),
  q: z.string().optional(),
  sortBy: z.enum(["most-loved", "most-recents"]).optional(),
  page: z
    .string()
    .optional()
    .transform((page) => Number(page) || void 0),
  size: z
    .string()
    .optional()
    .transform((size) => Number(size) || void 0),
});

export type SearchRecipesInput = z.infer<typeof searchRecipesSchema>;

export type SortByProperty = z.infer<typeof searchRecipesSchema>["sortBy"];

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
    category: Category;
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
    const searchRecipesInputParsed =
      searchRecipesSchema.parse(searchRecipesInput);

    const result = await this.recipesRepository.search(
      searchRecipesInputParsed,
    );

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
      category: recipe.category,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    }));

    return {
      total: result.total,
      items: mappedResult,
    };
  }
}
