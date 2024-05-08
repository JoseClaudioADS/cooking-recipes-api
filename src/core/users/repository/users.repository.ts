import { CreateUserRepositoryInput, CreateUserRepositoryOutput } from "./types/create-user.repository.type";

export interface UsersRepository {
    createUser(createUserRepositoryInput: CreateUserRepositoryInput): Promise<CreateUserRepositoryOutput>;
}
