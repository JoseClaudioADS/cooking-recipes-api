import * as z from "zod";
import { CreateMagicLinkService } from "../../magic-link/services/create-magic-link.service";
import { User } from "../entity/user";
import { EmailAlreadyRegisteredError } from "../errors/email-already-registered.error";
import { UsersRepository } from "../repository/users.repository";

const createUserSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 *
 */
export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly createMagicLinkService: CreateMagicLinkService,
  ) {}

  async execute(createUserInput: CreateUserInput): Promise<number> {
    const { name, bio, email } = createUserSchema.parse(createUserInput);

    let user = await this.usersRepository.findByEmail(email);

    if (user) {
      throw new EmailAlreadyRegisteredError(email);
    }

    const { id } = await this.usersRepository.createUser({ name, bio, email });

    user = new User(id, name, bio || null, email);

    await this.createMagicLinkService.execute({ user });

    return id;
  }
}
