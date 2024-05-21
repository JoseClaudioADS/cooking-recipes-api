import { sign } from "jsonwebtoken";
import * as z from "zod";
import env from "../../../utils/env";
import logger from "../../../utils/logger";
import { User } from "../../users/entity/user";
import { MagicLinkRepository } from "../repository/magic-link.repository";

const createMagicLinkSchema = z.object({
  user: z.instanceof(User),
});

export type CreateMagicLinkInput = z.infer<typeof createMagicLinkSchema>;

export type CreateMagicLinkOutput = {
  magicLink: string;
};

/**
 *
 */
export class CreateMagicLinkService {
  constructor(private readonly magicLinkRepository: MagicLinkRepository) {}

  async execute(
    createMagicLinkInput: CreateMagicLinkInput,
  ): Promise<CreateMagicLinkOutput> {
    const { user } = createMagicLinkSchema.parse(createMagicLinkInput);

    const magicLinkDb = await this.magicLinkRepository.findByEmail(user.email);

    if (magicLinkDb) {
      await this.magicLinkRepository.deleteMagicLink(magicLinkDb.token);
    }

    const { magicLink, token } = CreateMagicLinkService.generateMagicLink(user);

    await this.magicLinkRepository.createMagicLink(user, token);

    // TODO: send magic link
    logger.info(`${env.API_URL}/magic-link/sign-in?token=${token}`);
    // END TODO

    return { magicLink };
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
