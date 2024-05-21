import { Request, Response } from "express";
import { CreateMagicLinkService } from "../../../core/magic-link/services/create-magic-link.service";
import { UsersRepository } from "../../../core/users/repository/users.repository";
import { CreateUserUseCase } from "../../../core/users/use-case/create-user.use-case";

/**
 *
 */
export class UsersController {
  private readonly createUserUseCase: CreateUserUseCase;

  constructor(
    readonly usersRepository: UsersRepository,
    createMagicLinkService: CreateMagicLinkService,
  ) {
    this.createUserUseCase = new CreateUserUseCase(
      usersRepository,
      createMagicLinkService,
    );
  }

  async create(req: Request, res: Response): Promise<void> {
    await this.createUserUseCase.execute(req.body);

    res.sendStatus(201);
  }
}
