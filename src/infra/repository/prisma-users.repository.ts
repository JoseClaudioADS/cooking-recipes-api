import { PrismaClient } from "@prisma/client";
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

}
