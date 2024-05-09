export type CreateRecipeRepositoryInput = {
  title: string;
  description?: string;
  preparationTime: number;
  ingredients: {
    name: string;
    quantity: string
  }[];
  photoId: number;
  userId: number;
}

export type CreateRecipeRepositoryOutput = {
  id: number;
}
