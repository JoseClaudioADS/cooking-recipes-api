export type CreateUserRepositoryInput = {
    name: string;
    profile?: string;
    email: string;
}

export type CreateUserRepositoryOutput = {
    id: number;
}
