import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import {
  assertNoSslModeInUrl,
  getDatabaseSsl,
  parseDatabaseUrl,
} from "./lib/db/ssl";

// drizzle-kit runs outside Next.js, so it doesn't get .env.local for free.
config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local.");
}

// With a CA configured, hand drizzle-kit the split-out credentials plus the
// TLS options; its `{ url }` form has nowhere to put a certificate.
const ssl = getDatabaseSsl();
if (ssl) assertNoSslModeInUrl(url);

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: ssl ? { ...parseDatabaseUrl(url), ssl } : { url },
  // Only ever diff/push the store's own schema. Without this, `db:push`
  // against a shared database (e.g. an existing Supabase project) would
  // propose dropping every `public` table it doesn't know about.
  schemaFilter: ["store"],
});
