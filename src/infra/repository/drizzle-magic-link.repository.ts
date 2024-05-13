import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { MagicLink } from "../../core/magic-link/entity/magic-link";
import { MagicLinkRepository } from "../../core/magic-link/repository/magic-link.repository";
import { User } from "../../core/users/entity/user";
import * as schema from "../db/drizzle-db-schema";
import { magicLinksTable, usersTable } from "../db/drizzle-db-schema";

/**
 *
 */
export class DrizzleMagicLinkRepository implements MagicLinkRepository {
  constructor(private readonly db: PostgresJsDatabase<typeof schema>) {}

  async createMagicLink(user: User, token: string): Promise<void> {
    await this.db.insert(magicLinksTable).values({
      userId: user.id,
      token,
    });
  }

  async deleteMagicLink(token: string): Promise<void> {
    await this.db
      .delete(magicLinksTable)
      .where(eq(magicLinksTable.token, token));
  }

  async findByEmail(email: string): Promise<MagicLink | null> {
    const result = await this.db
      .select()
      .from(magicLinksTable)
      .innerJoin(usersTable, eq(magicLinksTable.userId, usersTable.id))
      .where(eq(usersTable.email, email));

    if (result.length === 0) {
      return null;
    }

    const magicLink = result[0];

    return {
      token: magicLink.magic_links.token,
      user: {
        id: magicLink.users.id,
        name: magicLink.users.name,
        email: magicLink.users.email,
        bio: magicLink.users.bio,
      },
      createdAt: magicLink.magic_links.createdAt,
    };
  }

  async findByToken(token: string): Promise<MagicLink | null> {
    const magicLink = await this.db.query.magicLinksTable.findFirst({
      with: {
        user: true,
      },
      where: eq(magicLinksTable.token, token),
    });

    if (!magicLink) {
      return null;
    }

    return {
      token: magicLink.token,
      user: {
        id: magicLink.user.id,
        name: magicLink.user.name,
        email: magicLink.user.email,
        bio: magicLink.user.bio,
      },
      createdAt: magicLink.createdAt,
    };
  }
}
