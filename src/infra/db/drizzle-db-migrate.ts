import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import db, { pool } from "./drizzle-db";

export const migrateDb = async () => {
  await migrate(db, { migrationsFolder: "./db/migrations" });
  await pool.end();
};

migrateDb();
