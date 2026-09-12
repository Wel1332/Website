"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="link cursor-pointer bg-transparent p-0 font-mono text-[0.72rem] uppercase tracking-[0.16em] disabled:cursor-wait"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
