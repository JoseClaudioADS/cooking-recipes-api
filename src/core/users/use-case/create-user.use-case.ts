import * as z from "zod";
import { EmailAlreadyRegisteredError } from "../errors/email-already-registered.error";
import { UsersRepository } from "../repository/users.repository";

const createUserSchema = z.object({
    name: z.string().min(2),
    bio: z.string().optional(),
    email: z.string().email()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 *
 */
export class CreateUserUseCase {

    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(createUserInput: CreateUserInput): Promise<number> {
        const { name, bio, email } = createUserSchema.parse(createUserInput);

        const user = await this.usersRepository.findByEmail(email);

        if (user) {
            throw new EmailAlreadyRegisteredError(email);
        }

        const { id } = await this.usersRepository.createUser({ name, bio, email });

        return id;
    }
}
