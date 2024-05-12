import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { User } from "../../core/users/entity/user";
import {
  CreateUserRepositoryInput,
  CreateUserRepositoryOutput,
} from "../../core/users/repository/types/create-user.repository.type";
import { UsersRepository } from "../../core/users/repository/users.repository";
import * as schema from "../db/drizzle-db-schema";
import { users } from "../db/drizzle-db-schema";

/**
 *
 */
export class DrizzleUsersRepository implements UsersRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async createUser({
    name,
    bio,
    email,
  }: CreateUserRepositoryInput): Promise<CreateUserRepositoryOutput> {
    const user = await this.db
      .insert(users)
      .values({
        name,
        bio,
        email,
      })
      .returning({ id: users.id });

    return { id: user[0].id };
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (result.length === 0) {
      return null;
    }

    const user = result[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
    };
  }
}
