import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import env from "../../utils/env";

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

export const migrateDb = async () => {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./src/infra/db/migrations",
  });

  await migrationClient.end();
};

migrateDb();
