import { User } from "../entity/user";
import { CreateUserRepositoryInput, CreateUserRepositoryOutput } from "./types/create-user.repository.type";

/**
 * Users Aggregate Repository (User | MagicLink)
 */
export interface UsersRepository {
    createUser(createUserRepositoryInput: CreateUserRepositoryInput): Promise<CreateUserRepositoryOutput>;
    findByEmail(email: string): Promise<User | null>;
    createMagicLink(user: User, token: string): Promise<void>;
}
