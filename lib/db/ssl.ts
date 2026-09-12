/* TLS for the pg driver, shared by the app (lib/db/index.ts) and drizzle-kit
   (drizzle.config.ts).

   Managed Postgres hosts such as Supabase sign their server certificates with
   a private CA, so `pg` — which verifies certificates by default — refuses
   the connection unless it's handed that CA. Set DATABASE_CA_CERT to the PEM
   text (Supabase: Settings → Database → SSL → download certificate). The CA
   is public, not a secret. Leave it unset for a local docker-compose database. */

export interface DatabaseSsl {
  ca: string;
  rejectUnauthorized: true;
}

export function getDatabaseSsl(): DatabaseSsl | undefined {
  const ca = process.env.DATABASE_CA_CERT?.trim();
  if (!ca) return undefined;
  return { ca, rejectUnauthorized: true };
}

/* An `sslmode=` in the URL would silently override the explicit `ssl` option
   when pg merges the two (the parsed URL wins) — and drop the CA with it. */
export function assertNoSslModeInUrl(connectionString: string): void {
  if (/[?&]sslmode=/i.test(connectionString)) {
    throw new Error(
      "DATABASE_URL contains sslmode= while DATABASE_CA_CERT is set. Remove sslmode from the URL — the certificate option configures TLS on its own."
    );
  }
}

/** Splits a postgres:// URL into the parts drizzle-kit's non-url form wants. */
export function parseDatabaseUrl(connectionString: string) {
  const u = new URL(connectionString);
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 5432,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
  };
}
