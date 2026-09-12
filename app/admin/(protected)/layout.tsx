// Everything in this route group requires a session. middleware.ts already
// redirects anonymous requests, but a Server Component shouldn't trust that
// alone — a matcher typo would otherwise expose these pages.
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminShell from "@/frontend/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}>{children}</AdminShell>;
}
