import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { MagicLink } from "../../core/magic-link/entity/magic-link";
import { MagicLinkRepository } from "../../core/magic-link/repository/magic-link.repository";
import { User } from "../../core/users/entity/user";
import * as schema from "../db/drizzle-db-schema";
import { magicLinks, users } from "../db/drizzle-db-schema";

/**
 *
 */
export class DrizzleMagicLinkRepository implements MagicLinkRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async createMagicLink(user: User, token: string): Promise<void> {
    await this.db.insert(magicLinks).values({
      userId: user.id,
      token,
    });
  }

  async deleteMagicLink(token: string): Promise<void> {
    await this.db.delete(magicLinks).where(eq(magicLinks.token, token));
  }

  async findByEmail(email: string): Promise<MagicLink | null> {
    const result = await this.db
      .select()
      .from(magicLinks)
      .innerJoin(users, eq(magicLinks.userId, users.id))
      .where(eq(users.email, email));

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
    const result = await this.db
      .select()
      .from(magicLinks)
      .innerJoin(users, eq(magicLinks.userId, users.id))
      .where(eq(magicLinks.token, token));

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
}
