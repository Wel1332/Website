/* node-postgres reports constraint failures as plain driver errors carrying a
   SQLSTATE in `.code` — there's no typed exception hierarchy to `instanceof`.
   Drizzle wraps that error in a DrizzleQueryError with the original on
   `.cause`, so walk the chain. */

const PG_UNIQUE_VIOLATION = "23505";
const PG_FOREIGN_KEY_VIOLATION = "23503";

function hasPgCode(err: unknown, code: string): boolean {
  let current: unknown = err;
  for (let depth = 0; depth < 5 && current && typeof current === "object"; depth++) {
    const { code: c, cause } = current as { code?: unknown; cause?: unknown };
    if (c === code) return true;
    current = cause;
  }
  return false;
}

export function isUniqueViolation(err: unknown): boolean {
  return hasPgCode(err, PG_UNIQUE_VIOLATION);
}

export function isForeignKeyViolation(err: unknown): boolean {
  return hasPgCode(err, PG_FOREIGN_KEY_VIOLATION);
}
