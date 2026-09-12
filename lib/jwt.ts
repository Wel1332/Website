import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

/* HS256 session tokens via `jose`. This module is imported by middleware.ts,
   which runs on the Edge runtime — keep it free of Node-only dependencies
   (no bcrypt, no `crypto` module, no pg). Password hashing lives in
   lib/password.ts for exactly that reason.

   Subpath imports on purpose: the `jose` barrel also pulls in JWE decryption,
   whose deflate helper trips Next's Edge-runtime lint at build time. */

export type Role = "ADMIN" | "STAFF";

export interface SessionPayload {
  sub: string; // user id
  email: string;
  role: Role;
}

export const SESSION_TTL_SECONDS = 8 * 60 * 60;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to .env.local."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signJwt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

/** Returns the payload for a valid, unexpired token; null for anything else. */
export async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "STAFF")
    ) {
      return null;
    }
    return { sub: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}
