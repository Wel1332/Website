# Digital Store Starter — Next.js + Stripe + Postgres

A complete, production-ready storefront for selling **digital products** —
templates, presets, ebooks, courses, anything downloadable. Built with
**Next.js 15, React 19, TypeScript, Tailwind CSS, Stripe Checkout, and
Postgres (Drizzle ORM)**, with a small **admin panel** for managing the
catalogue and reviewing orders.

Spin up the database, seed it, add your Stripe keys, deploy. That's it.

> **Reality check:** a store doesn't make money on its own. You still need a
> real product people want and a way to get visitors (social, SEO, communities).
> This repo handles the entire *technical* side so you can focus on that.

---

## What's included

- **Premium dark landing page** — sticky nav, hero, product catalogue,
  "how it works", testimonials, money-back guarantee, and FAQ.
- **Stripe Checkout** — secure hosted payment; card data never touches your server.
- **Orders recorded automatically** — the Stripe webhook writes every paid
  session to Postgres (idempotently, so Stripe retries can't double-count).
- **Admin panel at `/admin`** — sign in, create/edit/hide/delete products, and
  (for admins) review orders. Changes appear on the storefront immediately.
- **Two roles** — `ADMIN` sees everything; `STAFF` can manage the catalogue but
  never sees order or revenue data.
- **SEO done for you** — metadata, Open Graph + Twitter cards, a dynamically
  generated social-share image, a favicon, and Product structured data (JSON-LD).
- **Accessibility** — keyboard focus styles, skip link, semantic landmarks, alt text.
- **Legal pages** — Terms, Privacy, and Refund templates wired into the footer.
- **Scroll animations** — subtle reveal-on-scroll that respects reduced-motion.
- Fully **responsive** and **typed** end to end.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens — re-skin in seconds)
- **Postgres** via **Drizzle ORM** + the `pg` driver
- **Stripe** Checkout + webhooks
- **jose** (JWT) + **bcryptjs** (password hashing) + **zod** (validation)
- Zero secrets in code — keys live in `.env.local` (gitignored)

### Why these choices

- **Drizzle, not Prisma.** Prisma downloads a query-engine binary at install
  time, which restrictive networks (corporate proxies, locked-down CI) can
  block. Drizzle is plain TypeScript talking to Postgres through the `pg`
  driver — nothing to fetch, and the schema in `lib/db/schema.ts` *is* the
  source of truth.
- **jose, not jsonwebtoken.** The session check runs in `middleware.ts`, which
  Next.js executes on the Edge runtime. `jsonwebtoken` needs Node's `crypto`
  module and breaks there; `jose` uses Web Crypto and works in both. For the
  same reason password hashing (`bcryptjs`, Node-only) lives in its own file
  (`lib/password.ts`) and is never imported by anything the middleware touches.
- **Authentication in middleware, authorization in routes.** `middleware.ts`
  answers one question — *is there a valid session?* — and redirects or 401s
  if not. *What may this user do?* is decided in each route handler and page
  (`requireRole(req, "ADMIN")`, `if (user.role !== "ADMIN")`), because STAFF
  should reach `/admin` but not everything beneath it. The protected layout
  re-checks the session too, so a matcher typo can't expose a page.

---

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then set JWT_SECRET (see below); Stripe keys optional to start

docker compose up -d               # Postgres 16 on localhost:5432 (user/pass/db: store)
npm run db:push                    # create the tables from lib/db/schema.ts
npm run db:seed                    # 3 starter products + the admin user

npm run dev
```

Open **http://localhost:3000** for the store and **http://localhost:3000/admin**
for the admin panel. Sign in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
from `.env.local` (defaults: `admin@example.com` / `changeme123` — change
them). The **Buy** buttons need Stripe configured (below) — until then they
return a "not configured" message.

Generate `JWT_SECRET` with:

```bash
openssl rand -base64 32
```

No Docker? Any Postgres works — point `DATABASE_URL` at it and run the same
`db:push` / `db:seed` steps. All of the store's tables live in their own
Postgres schema, `store`, so an existing database with other tables in it is
fine: drizzle-kit only ever touches that schema.

### Using Supabase (or another host with a private CA)

1. Dashboard → **Connect** → copy the **Session pooler** URI (port 5432, user
   `postgres.<ref>`) into `DATABASE_URL`. The free plan's direct connection is
   IPv6-only, so use the pooler from your machine. Don't add `sslmode=` to it.
2. Settings → **Database** → **SSL** → download the certificate, and paste its
   contents into `DATABASE_CA_CERT` (in double quotes). Supabase signs its
   server certificates with its own CA, and the `pg` driver refuses to
   connect until it can verify against it.
3. `npm run db:push` then `npm run db:seed`.

Keep the tables in the `store` schema. On Supabase, everything in `public` is
served through the Data API to anyone holding the anon key — which would
expose `users.password_hash` and `orders.customer_email`. The `store` schema
isn't exposed unless you add it to the API's schema list, so don't.

### Database scripts

| Script                | What it does                                                     |
| --------------------- | ---------------------------------------------------------------- |
| `npm run db:push`     | Sync the schema straight to the database (dev + simple deploys) |
| `npm run db:seed`     | Upsert the starter products (by slug) and create the admin user  |
| `npm run db:studio`   | Browse the data in Drizzle Studio                                |
| `npm run db:generate` | Write a versioned SQL migration to `./drizzle` from the schema   |
| `npm run db:migrate`  | Apply the migrations in `./drizzle`                              |

The seed is safe to re-run: products are upserted by `slug`, and the admin
user is only created if the email is new (an existing password is never
overwritten).

`db:push` is the documented path. If you'd rather keep versioned migrations,
switch to `db:generate` + `db:migrate` and commit the `drizzle/` folder — just
pick one and stick with it, so there's exactly one thing that changes the
schema.

---

## Manage your store

**Products** are managed at **`/admin/products`** — name, slug, tagline, price,
image path, features (one per line), and an *active* switch. Hidden products
stay in the admin list but disappear from the storefront and can't be bought.
Products that already have orders can't be deleted (the sale record must
outlive the listing); hide them instead.

**Product images:** put them in `public/images/` and enter the path (for
example `/images/my-product.png`) in the form. Recommended **1200 × 720px**
(≈5:3), PNG or JPG, under ~300KB. The included `.svg` files are placeholders.

**Store name, tagline, email** live in `shared/products.ts`:

```ts
export const store = {
  brand: "Your Store",
  blurb: "Your one-line pitch.",
  supportEmail: "you@yourstore.com",
};
```

**Users** are seed-only / admin-managed — there's no public sign-up, because
this is an internal panel rather than customer accounts. To add a user, insert
a row into `users` with a bcrypt hash (the `hashPassword` helper in
`lib/password.ts` produces one), role `ADMIN` or `STAFF`.

---

## Connect Stripe (so payments work)

1. Create a free account at https://stripe.com
2. Dashboard → **Developers → API keys** → copy your **test** secret key (`sk_test_…`)
3. In `.env.local` set:
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
4. Restart `npm run dev`. Click **Buy** → real Stripe Checkout. Test with card
   `4242 4242 4242 4242`, any future date / CVC.

### Recording and delivering orders

The webhook at `app/api/webhook/route.ts` fires on successful payment. It
writes an `orders` row (status `PAID`) keyed on the Stripe session id, so
retried deliveries update the same row instead of creating a duplicate. Paid
orders then show up at `/admin/orders`.

Delivering the files is up to you:
- **Easiest:** in the Stripe Dashboard, attach the file to the product and let
  Stripe email it automatically.
- **Custom:** add your logic where the `TODO` is in `backend/webhook.ts`.

To test the webhook locally:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Deploy (free)

1. **Create a Postgres database.** The free tiers at [Neon](https://neon.tech)
   or [Supabase](https://supabase.com) are plenty. Copy its connection string.
2. **Create the tables and seed it** from your machine, against the production
   database:
   ```bash
   DATABASE_URL="postgresql://…production…" SEED_ADMIN_EMAIL=you@yourstore.com SEED_ADMIN_PASSWORD='a-strong-one' npm run db:push
   DATABASE_URL="postgresql://…production…" SEED_ADMIN_EMAIL=you@yourstore.com SEED_ADMIN_PASSWORD='a-strong-one' npm run db:seed
   ```
   (Or temporarily set those values in `.env.local` — just don't leave the
   production URL there.)
3. Push to a GitHub repo and import it at https://vercel.com.
4. In Vercel → **Settings → Environment Variables**, add:
   - `DATABASE_URL` — the production connection string from step 1. On
     Supabase use the **Transaction pooler** (port 6543) here — it's built for
     serverless, and this app never uses named prepared statements, which is
     the one thing that mode doesn't support.
   - `DATABASE_CA_CERT` — the host's CA certificate, if it needs one (see
     "Using Supabase" above)
   - `JWT_SECRET` — a fresh `openssl rand -base64 32` (not the one from dev)
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_BASE_URL=https://yourstore.com`
5. Deploy, then add a Stripe webhook pointing at `https://yourstore.com/api/webhook`
   for the `checkout.session.completed`, `checkout.session.async_payment_succeeded`
   and `checkout.session.async_payment_failed` events.

Whenever you change `lib/db/schema.ts`, run `db:push` against production again
before deploying the code that depends on it.

---

## ✅ Before you go live

- [ ] Replace the seeded products and images from `/admin/products`
- [ ] Set your brand, blurb, and support email in `shared/products.ts`
- [ ] Change the seeded admin password (or seed production with a strong one)
- [ ] Swap test Stripe keys for **live** keys in Vercel
- [ ] Set `NEXT_PUBLIC_BASE_URL` to your real domain
- [ ] Fill in the `[BRACKETED]` placeholders in `app/terms`, `app/privacy`, `app/refund`
- [ ] Replace the placeholder testimonials in `frontend/components/StorePage.tsx`

---

## 📁 Project structure

The `app/` folder is a thin routing layer Next.js requires — each file delegates
to the real code in `frontend/`, `backend/`, or `lib/`.

```
frontend/                 ← all browser/UI code
  components/
    StorePage.tsx         storefront (sections + content arrays)
    ProductCard.tsx       product card + "Buy" button
    SuccessPage.tsx       post-purchase thank-you
    LegalPage.tsx         shared layout for legal pages
    Hallmark.tsx          the house mark (SVG)
    Reveal.tsx            scroll-reveal animation wrapper
    admin/
      LoginForm.tsx       sign-in form
      AdminShell.tsx      admin header/nav (Orders link is ADMIN-only)
      Dashboard.tsx       product count (+ paid orders for ADMIN)
      ProductsManager.tsx product table + create/edit form
      OrdersTable.tsx     orders list
      SignOutButton.tsx
  styles/globals.css      Tailwind theme tokens + base styles

backend/                  ← all server logic
  checkout.ts             creates a Stripe Checkout session
  webhook.ts              verifies Stripe events, records orders
  stripe.ts               Stripe client (lazy, safe without keys)
  auth.ts                 login / logout / me + requireUser / requireRole guards
  admin-products.ts       product CRUD handlers
  admin-orders.ts         orders query + handler (ADMIN only)

lib/
  db/schema.ts            Drizzle tables: users, products, orders (schema "store")
  db/index.ts             getDb() — lazy pg Pool + Drizzle client
  db/ssl.ts               CA-certificate TLS options shared with drizzle-kit
  products.ts             listActiveProducts(), getProductById()
  jwt.ts                  sign/verify HS256 session tokens (Edge-safe)
  password.ts             bcrypt hash/verify (Node-only, kept apart from jwt.ts)
  session.ts              session cookie helpers
  validation.ts           zod schemas for login + products
  db-errors.ts            isUniqueViolation() etc. for pg error codes

shared/
  products.ts             Product type, store branding, formatPrice()

scripts/
  seed.ts                 starter products + admin user

app/                      ← thin Next.js routing layer
  layout.tsx              metadata, fonts
  page.tsx                → reads products, renders frontend/StorePage
  success/page.tsx        → frontend/SuccessPage
  terms|privacy|refund/   legal pages
  opengraph-image.tsx     dynamic social-share image
  icon.svg                favicon
  admin/login/page.tsx    public sign-in page
  admin/(protected)/      layout checks the session; dashboard, products, orders
  api/checkout/route.ts   → backend/checkout
  api/webhook/route.ts    → backend/webhook
  api/auth/*/route.ts     → backend/auth
  api/admin/*/route.ts    → backend/admin-products, backend/admin-orders

middleware.ts             session gate for /admin and /api/admin
drizzle.config.ts         drizzle-kit config (reads .env.local)
docker-compose.yml        local Postgres 16
public/images/            product images
```

## 🎨 Customizing the look

Colors and fonts are design tokens in `frontend/styles/globals.css` under
`@theme`. Change `--color-accent` to re-skin the whole site instantly.

---

## License

See [LICENSE.md](LICENSE.md).
