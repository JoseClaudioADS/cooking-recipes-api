import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { RecipesRepository } from "../repository/recipes.repository";
import { SearchRecipesRepositoryInput } from "../repository/types/search-recipes.repository.type";
import {
  SearchRecipesInput,
  SearchRecipesUseCase,
} from "./search-recipes.use-case";

describe("SearchRecipesUseCase", () => {
  let useCase: SearchRecipesUseCase;
  let recipesRepository: RecipesRepository;

  beforeAll(() => {
    recipesRepository = {
      search: vi.fn(),
    } as unknown as RecipesRepository;

    useCase = new SearchRecipesUseCase(recipesRepository);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {
    const input: SearchRecipesInput = {};

    it("should search recipes", async () => {
      vi.spyOn(recipesRepository, "search").mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await useCase.execute(input);

      expect(recipesRepository.search).toHaveBeenCalledWith(
        {} as SearchRecipesRepositoryInput,
      );
    });
  });

  describe("given an invalid input", () => {
    it.skip("should not search recipes");
  });
});
