import { defineConfig } from "drizzle-kit";
import path from "path";

// DATABASE_URL is required at runtime but may be absent in static-analysis
// contexts (e.g. Knip). Defer validation to actual Drizzle commands so that
// tooling that only imports this file does not fail.
const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://localhost/placeholder";

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
