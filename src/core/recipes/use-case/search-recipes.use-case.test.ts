import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { UploadService } from "../../shared/services/upload.service";
import { RecipesRepository } from "../repository/recipes.repository";
import { SearchRecipesRepositoryInput } from "../repository/types/search-recipes.repository.type";
import {
  SearchRecipesInput,
  SearchRecipesUseCase,
} from "./search-recipes.use-case";

describe("SearchRecipesUseCase", () => {
  let useCase: SearchRecipesUseCase;
  let recipesRepository: RecipesRepository;
  let uploadService: UploadService;

  beforeAll(() => {
    recipesRepository = {
      search: vi.fn(),
    } as unknown as RecipesRepository;

    uploadService = {
      getUrl: vi.fn(),
    } as unknown as UploadService;

    useCase = new SearchRecipesUseCase(recipesRepository, uploadService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {
    const input = {};

    it("should search recipes", async () => {
      vi.spyOn(recipesRepository, "search").mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await useCase.execute(input as SearchRecipesInput);

      expect(recipesRepository.search).toHaveBeenCalledWith({
        page: 1,
        size: 15,
        ...input,
      } as SearchRecipesRepositoryInput);
    });
  });

  describe("given an invalid input", () => {
    it.skip("should not search recipes");
  });
});
