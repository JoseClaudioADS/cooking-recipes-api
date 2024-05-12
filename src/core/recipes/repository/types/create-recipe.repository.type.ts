export type CreateRecipeRepositoryInput = {
  title: string;
  description?: string;
  preparationTime: number;
  steps: string;
  ingredients: {
    name: string;
    quantity: string;
  }[];
  photoId: number;
  userId: number;
  categoryId: number;
};

export type CreateRecipeRepositoryOutput = {
  id: number;
};
