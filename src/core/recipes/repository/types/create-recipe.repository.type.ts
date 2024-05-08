export type CreateRecipeRepositoryInput = {
  title: string;
  description?: string;
  preparationTime: number;
  ingredients: string[];
  photoId: number;
  userId: number;
}
