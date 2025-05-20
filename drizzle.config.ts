import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const connectionString = process.env.NODE_ENV != "test" ? process.env.DATABASE_URL : process.env.DATABASE_URL_TEST;

console.log(`Drizzle Kit Config connectionString: ${connectionString}`);

if (!connectionString) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
