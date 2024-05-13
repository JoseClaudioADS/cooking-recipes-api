import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import env from "../../utils/env";
import * as schema from "./drizzle-db-schema";

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, {
  schema,
  logger: env.NODE_ENV !== "production",
});
