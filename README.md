# Digital Store Starter — Next.js + Stripe

A complete, production-ready storefront for selling **digital products** —
templates, presets, ebooks, courses, anything downloadable. Built with
**Next.js 15, React 19, TypeScript, Tailwind CSS, and Stripe Checkout**.

Drop in your products, add your Stripe keys, deploy. That's it.

> **Reality check:** a store doesn't make money on its own. You still need a
> real product people want and a way to get visitors (social, SEO, communities).
> This repo handles the entire *technical* side so you can focus on that.

---

## ✨ What's included

- **Premium dark landing page** — sticky nav, hero, product grid, stats band,
  "how it works", testimonials, money-back guarantee, and FAQ.
- **Stripe Checkout** — secure hosted payment; card data never touches your server.
- **Instant-delivery ready** — webhook endpoint scaffolded for order fulfillment.
- **One file to edit your whole store** — `shared/products.ts`.
- **SEO done for you** — metadata, Open Graph + Twitter cards, a dynamically
  generated social-share image, a favicon, and Product structured data (JSON-LD).
- **Accessibility** — keyboard focus styles, skip link, semantic landmarks, alt text.
- **Legal pages** — Terms, Privacy, and Refund templates wired into the footer.
- **Scroll animations** — subtle reveal-on-scroll that respects reduced-motion.
- Fully **responsive** and **typed** end to end.

## 🧰 Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens — re-skin in seconds)
- **Stripe** Checkout + webhooks
- **lucide-react** icons, **Inter / Inter Tight** fonts via `next/font`
- Zero secrets in code — keys live in `.env.local` (gitignored)

---

## 🚀 Run locally

```bash
npm install
cp .env.local.example .env.local   # then add your Stripe keys (optional to start)
npm run dev
```

Open **http://localhost:3000**. The store renders immediately. The **Buy**
buttons need Stripe configured (next step) — until then they return a
"not configured" message.

---

## 🛍️ Edit your store

Everything lives in **`shared/products.ts`**.

**Store name, tagline, email:**
```ts
export const store = {
  brand: "Your Store",
  blurb: "Your one-line pitch.",
  supportEmail: "you@yourstore.com",
};
```

**Each product:**
```ts
{
  id: "my-product",                 // unique, url-safe
  name: "My Awesome Product",
  tagline: "One line that sells it.",
  priceCents: 1900,                 // 1900 = $19.00
  currency: "usd",
  image: "/images/my-product.png",  // a file in /public/images
  features: ["What they get", "Another benefit", "And another"],
}
```

**Product images:** put them in `public/images/`. Recommended **1200 × 720px**
(≈5:3), PNG or JPG, under ~300KB. The included `.svg` files are placeholders —
replace them and update the `image:` path.

---

## 💳 Connect Stripe (so payments work)

1. Create a free account at https://stripe.com
2. Dashboard → **Developers → API keys** → copy your **test** secret key (`sk_test_…`)
3. In `.env.local` set:
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
4. Restart `npm run dev`. Click **Buy** → real Stripe Checkout. Test with card
   `4242 4242 4242 4242`, any future date / CVC.

### Delivering files after payment
The webhook at `app/api/webhook/route.ts` fires on successful payment.
- **Easiest:** in the Stripe Dashboard, attach the file to the product and let
  Stripe email it automatically.
- **Custom:** add your logic where the `TODO` is in `backend/webhook.ts`.

To test the webhook locally:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## 🌐 Deploy (free)

1. Push to a GitHub repo.
2. Import it at https://vercel.com (free tier is plenty).
3. In Vercel → **Settings → Environment Variables**, add `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, and `NEXT_PUBLIC_BASE_URL=https://yourstore.com`.
4. Deploy, then add a Stripe webhook pointing at `https://yourstore.com/api/webhook`.

---

## ✅ Before you go live

- [ ] Replace products and images in `shared/products.ts`
- [ ] Set your brand, blurb, and support email
- [ ] Swap test Stripe keys for **live** keys in Vercel
- [ ] Set `NEXT_PUBLIC_BASE_URL` to your real domain
- [ ] Fill in the `[BRACKETED]` placeholders in `app/terms`, `app/privacy`, `app/refund`
- [ ] Replace the placeholder stats & testimonials in `frontend/components/StorePage.tsx`

---

## 📁 Project structure

The `app/` folder is a thin routing layer Next.js requires — each file delegates
to the real code in `frontend/` or `backend/`.

```
frontend/                 ← all browser/UI code
  components/
    StorePage.tsx         storefront (sections + content arrays)
    ProductCard.tsx       product card + "Buy" button
    SuccessPage.tsx       post-purchase thank-you
    LegalPage.tsx         shared layout for legal pages
    Reveal.tsx            scroll-reveal animation wrapper
  styles/globals.css      Tailwind theme tokens + base styles

backend/                  ← all server logic
  checkout.ts             creates a Stripe Checkout session
  webhook.ts              verifies Stripe events (fulfillment hook)
  stripe.ts               Stripe client (lazy, safe without keys)

shared/
  products.ts             ← edit this to manage your catalog

app/                      ← thin Next.js routing layer
  layout.tsx              metadata, fonts
  page.tsx                → frontend/StorePage
  success/page.tsx        → frontend/SuccessPage
  terms|privacy|refund/   legal pages
  opengraph-image.tsx     dynamic social-share image
  icon.svg                favicon
  api/checkout/route.ts   → backend/checkout
  api/webhook/route.ts    → backend/webhook

public/images/            product images
```

## 🎨 Customizing the look

Colors and fonts are design tokens in `frontend/styles/globals.css` under
`@theme`. Change `--color-accent` to re-skin the whole site instantly.

---

## License

See [LICENSE.md](LICENSE.md).
