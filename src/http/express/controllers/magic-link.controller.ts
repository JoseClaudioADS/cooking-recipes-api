import { Request, Response } from "express";
import { MagicLinkRepository } from "../../../core/magic-link/repository/magic-link.repository";
import { CreateMagicLinkUseCase } from "../../../core/magic-link/use-case/create-magic-link.user-case";
import { UsersRepository } from "../../../core/users/repository/users.repository";

/**
 *
 */
export class MagicLinkController {

    private readonly createMagicLinkUseCase: CreateMagicLinkUseCase;

    constructor(readonly usersRepository: UsersRepository, readonly magicLinkRepository: MagicLinkRepository) {
        this.createMagicLinkUseCase = new CreateMagicLinkUseCase(usersRepository, magicLinkRepository);
    }

    async create(req: Request, res: Response): Promise<void> {
        await this.createMagicLinkUseCase.execute(req.body);

        res.sendStatus(201);
    }
}
