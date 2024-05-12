export type SearchRecipesRepositoryInput = {
  title?: string;
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
