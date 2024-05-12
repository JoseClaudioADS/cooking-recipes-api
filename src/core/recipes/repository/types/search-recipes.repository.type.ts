import { Recipe } from "../../entity/recipe";

export type SearchRecipesRepositoryInput = {
  title?: string;
};

export type SearchRecipesRepositoryOutput = {
  total: number;
  items: Recipe[];
};
