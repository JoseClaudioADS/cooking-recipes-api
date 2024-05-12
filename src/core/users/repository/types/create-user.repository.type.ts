export type CreateUserRepositoryInput = {
  name: string;
  bio?: string;
  email: string;
};

export type CreateUserRepositoryOutput = {
  id: number;
};
