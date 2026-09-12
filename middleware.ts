import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";

/* Authentication gate only: "is there a valid session?" Role checks live in
   the individual routes and pages — STAFF may reach /admin but not everything
   under it, and that decision belongs next to the data it protects. */

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const user = await getSessionUser(req);
  if (user) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
