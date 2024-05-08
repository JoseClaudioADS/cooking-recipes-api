import { User } from "../entity/user";
import { CreateUserRepositoryInput, CreateUserRepositoryOutput } from "./types/create-user.repository.type";

/**
 *
 */
export interface UsersRepository {
    createUser(createUserRepositoryInput: CreateUserRepositoryInput): Promise<CreateUserRepositoryOutput>;
    findByEmail(email: string): Promise<User | null>;
}
