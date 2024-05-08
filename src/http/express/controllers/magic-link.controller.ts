import { Request, Response } from "express";
import { UsersRepository } from "../../../core/users/repository/users.repository";
import { CreateMagicLinkUseCase } from "../../../core/users/use-case/create-magic-link.user-case";

/**
 *
 */
export class MagicLinkController {

    private readonly createMagicLinkUseCase: CreateMagicLinkUseCase;

    constructor(private readonly usersRepository: UsersRepository) {
        this.createMagicLinkUseCase = new CreateMagicLinkUseCase(usersRepository);
    }

    async create(req: Request, res: Response): Promise<void> {
        await this.createMagicLinkUseCase.execute(req.body);

        res.sendStatus(201);
    }
}
