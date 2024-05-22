import * as z from "zod";
import { UserByEmailNotFoundError } from "../../users/errors/user-by-email-not-found.error";
import { UsersRepository } from "../../users/repository/users.repository";
import { CreateMagicLinkService } from "../services/create-magic-link.service";

const createMagicLinkSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
});

export type CreateMagicLinkInput = z.infer<typeof createMagicLinkSchema>;

export type CreateMagicLinkOutput = {
  magicLink: string;
};

/**
 *
 */
export class CreateMagicLinkUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly createMagicLinkService: CreateMagicLinkService,
  ) {}

  async execute(
    createMagicLinkInput: CreateMagicLinkInput,
  ): Promise<CreateMagicLinkOutput> {
    const { email } = createMagicLinkSchema.parse(createMagicLinkInput);

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserByEmailNotFoundError(email);
    }

    const { magicLink } = await this.createMagicLinkService.execute({ user });

    return {
      magicLink,
    };
  }
}
