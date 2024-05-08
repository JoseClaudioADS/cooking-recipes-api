import { PrismaClient } from "@prisma/client";
import { MagicLink } from "../../core/magic-link/entity/magic-link";
import { MagicLinkRepository } from "../../core/magic-link/repository/magic-link.repository";
import { User } from "../../core/users/entity/user";
import { parseUser } from "./parsers/prisma-user.parser";


/**
 *
 */
export class PrismaMagicLinkRepository implements MagicLinkRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async createMagicLink(user: User, token: string): Promise<void> {
        await this.prisma.magicLink.create({
            data: {
                userId: user.id,
                token
            }
        });
    }

    async deleteMagicLink(token: string): Promise<void> {
        await this.prisma.magicLink.delete({
            where: {
                token
            }
        });
    }

    async findByEmail(email: string): Promise<MagicLink | null> {
        const magicLink = await this.prisma.magicLink.findFirst({
            where: {
                user: {
                    email
                }
            },
            include: {
                user: true
            }
        });

        if (!magicLink) {
            return null;
        }

        return {
            token: magicLink.token,
            user: parseUser(magicLink.user),
            createdAt: magicLink.createdAt
        };
    }

    async findByToken(token: string): Promise<MagicLink | null> {
        const magicLink = await this.prisma.magicLink.findFirst({
            where: {
                token
            },
            include: {
                user: true
            }
        });

        if (!magicLink) {
            return null;
        }

        return {
            token: magicLink.token,
            user: parseUser(magicLink.user),
            createdAt: magicLink.createdAt
        };
    }
}
