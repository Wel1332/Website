import Link from "next/link";
import type { ReactNode } from "react";
import { store } from "@/shared/products";
import type { SessionUser } from "@/lib/session";
import SignOutButton from "@/frontend/components/admin/SignOutButton";

/* Frame for every protected admin page: brand, section nav, who's signed in.
   The Orders link is only drawn for ADMIN — the page and API enforce it too. */
export default function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
          <div className="flex items-baseline gap-4">
            <Link
              className="font-display text-[1.2rem] font-extrabold tracking-[-0.04em]"
              href="/admin"
            >
              {store.brand}
            </Link>
            <span className="label">Admin</span>
          </div>
          <nav className="flex items-center gap-7 font-mono text-[0.72rem] uppercase tracking-[0.16em]">
            <Link className="link" href="/admin/products">
              Products
            </Link>
            {user.role === "ADMIN" && (
              <Link className="link" href="/admin/orders">
                Orders
              </Link>
            )}
            <Link className="link hidden sm:inline" href="/" target="_blank">
              Storefront ↗
            </Link>
          </nav>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-6 py-2.5">
            <span className="label normal-case tracking-[0.06em]">
              {user.email}{" "}
              <span className="text-accent">· {user.role}</span>
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-6 pb-24 pt-12">{children}</main>
    </>
  );
}
