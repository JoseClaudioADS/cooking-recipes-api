import { User } from "../../users/entity/user";
import { MagicLink } from "../entity/magic-link";

/**
 *
 */
export interface MagicLinkRepository {
  createMagicLink(user: User, token: string): Promise<void>;
  deleteMagicLink(token: string): Promise<void>;
  findByEmail(email: string): Promise<MagicLink | null>;
  findByToken(token: string): Promise<MagicLink | null>;
}
