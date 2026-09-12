// Thin routing layer — the real UI lives in /frontend.
// Deliberately outside the (protected) route group: this is the one /admin
// page that must render without a session.
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import LoginForm from "@/frontend/components/admin/LoginForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getCurrentUser()) redirect("/admin");
  return (
    // useSearchParams() needs a Suspense boundary above it.
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
