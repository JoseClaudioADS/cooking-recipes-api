import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { User } from "../../core/users/entity/user";
import {
  CreateUserRepositoryInput,
  CreateUserRepositoryOutput,
} from "../../core/users/repository/types/create-user.repository.type";
import { UsersRepository } from "../../core/users/repository/users.repository";
import * as schema from "../db/drizzle-db-schema";
import { usersTable } from "../db/drizzle-db-schema";

/**
 *
 */
export class DrizzleUsersRepository implements UsersRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async createUser({
    name,
    bio,
    email,
  }: CreateUserRepositoryInput): Promise<CreateUserRepositoryOutput> {
    const user = await this.db
      .insert(usersTable)
      .values({
        name,
        bio,
        email,
      })
      .returning({ id: usersTable.id });

    return { id: user[0].id };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!user) {
      return null;
    }

    return new User(user.id, user.name, user.bio, user.email);
  }
}
