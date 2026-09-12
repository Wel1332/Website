/* =============================================================
   STORE SETTINGS & SHARED TYPES
   Shared by the frontend (display) and backend (pricing).

   The catalogue itself lives in Postgres — manage it from /admin, or edit
   the starter rows in scripts/seed.ts and run `npm run db:seed`.

   priceCents: price in cents (e.g. 2900 = $29.00). Used by Stripe.
   image:      path under /public (e.g. "/images/notion-pack.svg")
   ============================================================= */

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  currency: string; // e.g. "usd"
  image: string;
  features: string[];
  active: boolean;
}

/* ---- STORE SETTINGS ----
   Edit these three lines to make the store yours. The brand name and blurb
   appear in the nav, hero, footer, page titles, and social-share image; the
   email is shown in the footer, FAQ, and legal pages. */
export const store = {
  brand: "Pixelforge",
  blurb: "Premium digital products, built once — yours forever.",
  supportEmail: "support@example.com",
};

export function formatPrice(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
