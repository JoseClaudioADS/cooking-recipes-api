import "dotenv/config";
import type { Config } from "drizzle-kit";
import env from "./src/utils/env";

export default {
  schema: "./src/infra/db/drizzle-db-schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
