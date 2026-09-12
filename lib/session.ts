import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import {
  SESSION_TTL_SECONDS,
  signJwt,
  verifyJwt,
  type SessionPayload,
} from "@/lib/jwt";

export const SESSION_COOKIE = "session";

export type SessionUser = SessionPayload;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function setSessionCookie(
  res: NextResponse,
  payload: SessionPayload
): Promise<void> {
  const token = await signJwt(payload);
  res.cookies.set(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

/** For route handlers and middleware — reads the cookie off the request. */
export async function getSessionUser(
  req: NextRequest
): Promise<SessionUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifyJwt(token) : null;
}

/** For Server Components — reads the cookie via next/headers. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifyJwt(token) : null;
}
