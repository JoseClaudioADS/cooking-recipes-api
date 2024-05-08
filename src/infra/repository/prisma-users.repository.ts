import { PrismaClient } from "@prisma/client";
import { MagicLink } from "../../core/magic-link/entity/magic-link";
import { User } from "../../core/users/entity/user";
import { CreateUserRepositoryInput, CreateUserRepositoryOutput } from "../../core/users/repository/types/create-user.repository.type";
import { UsersRepository } from "../../core/users/repository/users.repository";

/**
 *
 */
export class PrismaUsersRepository implements UsersRepository {

    constructor(private readonly prisma: PrismaClient) {}

    async createUser({ name, bio, email }: CreateUserRepositoryInput): Promise<CreateUserRepositoryOutput> {

        const user = await this.prisma.user.create({
            data: {
                name,
                bio,
                email
            }
        });

        return { id: user.id };
    }

    async findByEmail(email: string): Promise<User | null> {

        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            bio: user.bio
        };
    }

    async createMagicLink(user: User, token: string): Promise<void> {
        await this.prisma.magicLink.create({
            data: {
                userId: user.id,
                token
            }
        });
    }

    async deleteMagicLink(user: User): Promise<void> {
        await this.prisma.magicLink.delete({
            where: {
                userId: user.id
            }
        });
    }

    async findByEmail(email: string): Promise<MagicLink | null> {
        const magicLink = await this.prisma.magicLink.findFirst({
            where: {
                user: {
                    email
                }
            }
        });

        if (!magicLink) {
            return null;
        }

        return {
            token: magicLink.token,
            userId: magicLink.userId,
            createdAt: magicLink.createdAt
        };
    }
}
