"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { store } from "@/shared/products";

/* Only same-origin paths are honoured for the post-login redirect, so a
   crafted link can't bounce a signed-in admin to another site. */
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/admin";
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-in failed.");
      router.replace(safeNext(params.get("next")));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-[420px] flex-col justify-center px-6 py-20">
      <span className="label">{store.brand} · Admin</span>
      <h1 className="mt-5 text-[clamp(1.9rem,5vw,2.6rem)]">Sign in</h1>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="label">Email</span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
          />
        </label>

        {error && (
          <p
            role="alert"
            className="border-l-2 border-danger pl-3 font-mono text-[0.8rem] text-danger"
          >
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-brass" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </form>
    </div>
  );
}
