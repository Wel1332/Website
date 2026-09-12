import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import {
  clearSessionCookie,
  getSessionUser,
  setSessionCookie,
  type SessionUser,
} from "@/lib/session";
import { loginSchema } from "@/lib/validation";
import type { Role } from "@/lib/jwt";

const INVALID_CREDENTIALS = "Invalid email or password.";

// A real bcrypt hash of a throwaway string. When the email doesn't exist we
// still run one compare against this so "no such user" and "wrong password"
// take the same time — otherwise response latency leaks which emails exist.
const DUMMY_HASH =
  "$2b$10$RDUT6gJCfWebARkMXZrSbeeDqVKE2bbZHDVrfXTmYToPeqKdAdl.C";

/** POST /api/auth/login */
export async function handleLogin(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  const [user] = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, parsed.data.email))
    .limit(1);

  const ok = await verifyPassword(
    parsed.data.password,
    user?.passwordHash ?? DUMMY_HASH
  );
  if (!user || !ok) {
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 });
  }

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
  });
  await setSessionCookie(res, { sub: user.id, email: user.email, role: user.role });
  return res;
}

/** POST /api/auth/logout */
export async function handleLogout() {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}

/** GET /api/auth/me */
export async function handleMe(req: NextRequest) {
  const user = await getSessionUser(req);
  return NextResponse.json({ user });
}

/* ---- Guards for admin route handlers ----
   middleware.ts already turns away anonymous requests, but each handler
   re-checks so the protection doesn't hinge on a matcher pattern staying
   correct. Returns the user, or a ready-to-send error response. */

export async function requireUser(
  req: NextRequest
): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser(req);
  return user ?? NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function requireRole(
  req: NextRequest,
  role: Role
): Promise<SessionUser | NextResponse> {
  const user = await requireUser(req);
  if (user instanceof NextResponse) return user;
  return user.role === role
    ? user
    : NextResponse.json({ error: "Forbidden." }, { status: 403 });
}
