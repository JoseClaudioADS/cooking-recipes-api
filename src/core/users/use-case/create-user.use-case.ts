import * as z from "zod";
import { UsersRepository } from "../repository/users.repository";

const createUserSchema = z.object({
    name: z.string().min(2),
    profile: z.string().optional(),
    email: z.string().email()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 *
 */
export class CreateUserUseCase {

    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(createUserInput: CreateUserInput): Promise<number> {
        const { name, profile, email } = createUserSchema.parse(createUserInput);

        const { id } = await this.usersRepository.createUser({ name, profile, email });

        return id;
    }
}
