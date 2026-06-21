/* =============================================================
   YOUR PRODUCTS — edit this file to run your store.
   Shared by the frontend (display) and backend (pricing).

   priceCents: price in cents (e.g. 2900 = $29.00). Used by Stripe.
   image:      path under /public (e.g. "/images/notion-pack.svg")
   ============================================================= */

export interface Product {
  id: string;
  name: string;
  tagline: string;
  priceCents: number;
  currency: string; // e.g. "usd"
  image: string;
  features: string[];
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

export const products: Product[] = [
  {
    id: "notion-pack",
    name: "Ultimate Notion Productivity Pack",
    tagline: "12 plug-and-play templates to run your whole life.",
    priceCents: 2900,
    currency: "usd",
    image: "/images/notion-pack.svg",
    features: [
      "12 ready-to-use Notion templates",
      "Goal, habit & finance trackers",
      "Lifetime free updates",
      "Setup video included",
    ],
  },
  {
    id: "lightroom-presets",
    name: "Cinematic Lightroom Presets",
    tagline: "40 one-click presets for moody, film-style photos.",
    priceCents: 1900,
    currency: "usd",
    image: "/images/presets.svg",
    features: [
      "40 desktop & mobile presets",
      "Works with free Lightroom app",
      "Install guide for phone & PC",
      "Sample before/after gallery",
    ],
  },
  {
    id: "resume-kit",
    name: "Job-Winning Resume Kit",
    tagline: "ATS-friendly resume + cover letter templates.",
    priceCents: 1500,
    currency: "usd",
    image: "/images/resume.svg",
    features: [
      "6 recruiter-approved layouts",
      "Editable in Word & Google Docs",
      "Matching cover letter templates",
      "Bonus: interview cheat sheet",
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
