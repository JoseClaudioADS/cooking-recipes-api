import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const databaseUrl = `${process.env.DATABASE_URL}-test`;
const migrationClient = postgres(databaseUrl, { max: 1 });

export const setup = async () => {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./src/infra/db/migrations",
  });

  await migrationClient.end();
};

export default setup;
