import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const missingDatabaseMessage =
  "DATABASE_URL is not set. Legacy PostgreSQL/Drizzle persistence is unavailable until this route is migrated to MongoDB.";

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

const unavailableDb = new Proxy(
  {},
  {
    get() {
      throw new Error(missingDatabaseMessage);
    },
  },
) as ReturnType<typeof drizzle<typeof schema>>;

export const db = pool ? drizzle(pool, { schema }) : unavailableDb;

export * from "./schema";
