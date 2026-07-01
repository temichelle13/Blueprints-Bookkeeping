import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

type PgPool = InstanceType<typeof Pool>;
type PgDatabase = ReturnType<typeof drizzle>;

let poolInstance: PgPool | undefined;
let dbInstance: PgDatabase | undefined;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "Legacy PostgreSQL DATABASE_URL is not configured. This code path still depends on the old Drizzle/Postgres data layer and must be migrated to MongoDB before production use.",
    );
  }

  return databaseUrl;
}

function getPool(): PgPool {
  if (!poolInstance) {
    poolInstance = new Pool({ connectionString: getDatabaseUrl() });
  }

  return poolInstance;
}

function getDb(): PgDatabase {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), { schema });
  }

  return dbInstance;
}

export const pool = new Proxy({} as PgPool, {
  get(_target, property, receiver) {
    const value = Reflect.get(getPool(), property, receiver);
    return typeof value === "function" ? value.bind(getPool()) : value;
  },
});

export const db = new Proxy({} as PgDatabase, {
  get(_target, property, receiver) {
    const database = getDb();
    const value = Reflect.get(database, property, receiver);
    return typeof value === "function" ? value.bind(database) : value;
  },
});

export * from "./schema";
