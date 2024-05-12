import { User as PrismaUser } from "@prisma/client";
import { User } from "../../../core/users/entity/user";

export const parseUser = (user: PrismaUser): User => ({
  id: user.id,
  email: user.email,
  name: user.name,
  bio: user.bio,
});
