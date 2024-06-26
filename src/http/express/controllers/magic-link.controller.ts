import { Request, Response } from "express";
import { MagicLinkRepository } from "../../../core/magic-link/repository/magic-link.repository";
import { CreateMagicLinkService } from "../../../core/magic-link/services/create-magic-link.service";
import { CreateMagicLinkUseCase } from "../../../core/magic-link/use-case/create-magic-link.user-case";
import {
  SignInMagicLinkInput,
  SignInMagicLinkUseCase,
} from "../../../core/magic-link/use-case/sign-in-magic-link.user-case";
import { UsersRepository } from "../../../core/users/repository/users.repository";
import constants from "../../../utils/constants";
import env from "../../../utils/env";

/**
 *
 */
export class MagicLinkController {
  private readonly createMagicLinkUseCase: CreateMagicLinkUseCase;
  private readonly signInMagicLinkUseCase: SignInMagicLinkUseCase;

  constructor(
    readonly usersRepository: UsersRepository,
    readonly magicLinkRepository: MagicLinkRepository,
    createMagicLinkService: CreateMagicLinkService,
  ) {
    this.createMagicLinkUseCase = new CreateMagicLinkUseCase(
      usersRepository,
      createMagicLinkService,
    );
    this.signInMagicLinkUseCase = new SignInMagicLinkUseCase(
      magicLinkRepository,
    );
  }

  async create(req: Request, res: Response): Promise<void> {
    await this.createMagicLinkUseCase.execute(req.body);

    res.sendStatus(201);
  }

  async signIn(req: Request, res: Response): Promise<void> {
    const result = await this.signInMagicLinkUseCase.execute(
      req.query as SignInMagicLinkInput,
    );

    res.cookie(constants.TOKEN_COOKIE_NAME, result.token, {
      httpOnly: env.NODE_ENV === "production",
      secure: env.NODE_ENV === "production",
      sameSite: true,
    });
    res.redirect(302, env.WEB_URL);
  }
}
