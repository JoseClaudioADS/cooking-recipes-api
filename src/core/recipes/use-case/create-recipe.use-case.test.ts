import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { RecipesRepository } from "../repository/recipes.repository";
import { CreateRecipeRepositoryInput } from "../repository/types/create-recipe.repository.type";
import {
  CreateRecipeInput,
  CreateRecipeUseCase,
} from "./create-recipe.use-case";

describe("CreateRecipeUseCase", () => {
  let useCase: CreateRecipeUseCase;
  let recipesRepository: RecipesRepository;

  beforeAll(() => {
    recipesRepository = {
      create: vi.fn(),
    } as unknown as RecipesRepository;

    useCase = new CreateRecipeUseCase(recipesRepository);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {
    const input: CreateRecipeInput = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      steps: faker.lorem.paragraph(),
      photoId: faker.number.int(),
      preparationTime: faker.number.int(),
      ingredients: [
        {
          name: faker.lorem.word(),
          quantity: faker.lorem.word(),
        },
        {
          name: faker.lorem.word(),
          quantity: faker.lorem.word(),
        },
      ],
      userId: faker.number.int(),
      categoryId: faker.number.int(),
    };

    it("should create a recipe", async () => {
      vi.spyOn(recipesRepository, "create").mockResolvedValueOnce({
        id: faker.number.int(),
      });

      await useCase.execute(input);

      expect(recipesRepository.create).toHaveBeenCalledWith({
        ingredients: input.ingredients,
        steps: input.steps,
        preparationTime: input.preparationTime,
        photoId: input.photoId,
        title: input.title,
        userId: input.userId,
        categoryId: input.categoryId,
        description: input.description,
      } as CreateRecipeRepositoryInput);
    });
  });

  describe("given an invalid input", () => {
    it("should not create a recipe", async () => {
      await expect(useCase.execute({} as CreateRecipeInput)).rejects.toThrow(
        ZodError,
      );

      expect(recipesRepository.create).not.toHaveBeenCalled();
    });
  });
});
