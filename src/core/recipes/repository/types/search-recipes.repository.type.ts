import { SortByProperty } from "../../use-case/search-recipes.use-case";

export type SearchRecipesRepositoryInput = {
  title?: string;
  categoryId?: number;
  q?: string;
  sortBy?: SortByProperty;
  page?: number;
  size?: number;
};

export type SearchRecipesRepositoryOutput = {
  total: number;
  items: {
    id: number;
    title: string;
    description: string | null;
    steps: string;
    preparationTime: number;
    photo: {
      id: number;
      filename: string;
    };
    user: {
      id: number;
      name: string;
    };
    category: {
      id: number;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }[];
};
