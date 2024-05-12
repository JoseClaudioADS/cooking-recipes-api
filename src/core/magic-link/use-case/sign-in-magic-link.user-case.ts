import { sign, verify } from "jsonwebtoken";
import * as z from "zod";
import env from "../../../utils/env";
import logger from "../../../utils/logger";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { User } from "../../users/entity/user";
import { MagicLinkRepository } from "../repository/magic-link.repository";

const signInMagicLinkSchema = z.object({
  token: z.string().min(1)
});

export type SignInMagicLinkInput = z.infer<typeof signInMagicLinkSchema>;

export type SignInMagicLinkOutput = {
    token: string
}

/**
 *
 */
export class SignInMagicLinkUseCase {

  constructor(
      private readonly magicLinkRepository: MagicLinkRepository
  ) {}

  async execute(signInMagicLinkInput: SignInMagicLinkInput): Promise<SignInMagicLinkOutput> {
    const { token } = signInMagicLinkSchema.parse(signInMagicLinkInput);

    try {
      verify(token, env.JWT_SECRET_KEY);
    } catch (error) {
      logger.debug(`Magic link for token ${token} is invalid.`);
      throw new UnauthorizedError();
    }

    const magicLinkDb = await this.magicLinkRepository.findByToken(token);

    if (!magicLinkDb) {
      logger.debug(`Magic link for token ${token} not found.`);
      throw new UnauthorizedError();
    }

    const newToken = SignInMagicLinkUseCase.generateToken(magicLinkDb.user);

    await this.magicLinkRepository.deleteMagicLink(token);

    return {
      token: newToken
    };
  }

  private static generateToken(user: User): string {

    return sign({ id: user.id, email: user.email, name: user.name },
      env.JWT_SECRET_KEY,
      { expiresIn: env.JWT_EXPIRATION_TIME });

  }
}
