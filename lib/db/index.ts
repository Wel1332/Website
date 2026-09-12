import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema";
import { assertNoSslModeInUrl, getDatabaseSsl } from "@/lib/db/ssl";

export type Db = NodePgDatabase<typeof schema> & { $client: Pool };

/* Lazily built, like getStripe(): `next build` evaluates every route module
   while collecting page data, so nothing may need DATABASE_URL at import time.
   In dev, hot reload re-evaluates modules — the pool is parked on globalThis
   so reloads don't leak connections until Postgres hits max_connections. */

const globalForDb = globalThis as unknown as { __db?: Db };

let cached: Db | undefined;

export function getDb(): Db {
  if (cached) return cached;
  if (process.env.NODE_ENV !== "production" && globalForDb.__db) {
    cached = globalForDb.__db;
    return cached;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local.");
  }

  const ssl = getDatabaseSsl();
  if (ssl) assertNoSslModeInUrl(connectionString);

  cached = drizzle(new Pool({ connectionString, ssl }), { schema });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__db = cached;
  }
  return cached;
}

export { schema };
