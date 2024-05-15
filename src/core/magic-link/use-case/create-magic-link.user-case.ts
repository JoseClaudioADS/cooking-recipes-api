import { sign } from "jsonwebtoken";
import * as z from "zod";
import env from "../../../utils/env";
import logger from "../../../utils/logger";
import { User } from "../../users/entity/user";
import { UserByEmailNotFoundError } from "../../users/errors/user-by-email-not-found.error";
import { UsersRepository } from "../../users/repository/users.repository";
import { MagicLinkRepository } from "../repository/magic-link.repository";

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
    private readonly magicLinkRepository: MagicLinkRepository,
  ) {}

  async execute(
    createMagicLinkInput: CreateMagicLinkInput,
  ): Promise<CreateMagicLinkOutput> {
    const { email } = createMagicLinkSchema.parse(createMagicLinkInput);

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserByEmailNotFoundError(email);
    }

    const magicLinkDb = await this.magicLinkRepository.findByEmail(email);

    if (magicLinkDb) {
      await this.magicLinkRepository.deleteMagicLink(magicLinkDb.token);
    }

    const { magicLink, token } = CreateMagicLinkUseCase.generateMagicLink(user);

    await this.magicLinkRepository.createMagicLink(user, token);

    // TODO: send magic link
    logger.info(`${env.API_URL}/magic-link/sign-in?token=${token}`);
    // END TODO

    return {
      magicLink,
    };
  }

  private static generateMagicLink(user: User): {
    magicLink: string;
    token: string;
  } {
    const jwt = sign({ email: user.email }, env.JWT_SECRET_KEY, {
      expiresIn: "30m",
    });

    return {
      magicLink: `${env.API_URL}/magic-link?token=${jwt}`,
      token: jwt,
    };
  }
}
