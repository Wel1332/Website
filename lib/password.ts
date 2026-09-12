import bcrypt from "bcryptjs";

/* Node-only. Kept apart from lib/jwt.ts so middleware.ts (Edge runtime) never
   pulls bcryptjs — it leans on process.nextTick/setImmediate and Next.js will
   warn about it at build time if it lands in the Edge bundle. */

const ROUNDS = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
