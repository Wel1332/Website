/* Seeds Postgres with the starter catalogue and one admin user.
   Run with `npm run db:seed` after `npm run db:push`. Safe to re-run: products
   upsert by slug, the admin user is only created if the email is new. */
import { config } from "dotenv";

// Load env before anything that reads DATABASE_URL. lib/db is imported
// dynamically inside main() (not at the top) so the order is guaranteed even
// if a future change makes that module read env at import time.
config({ path: ".env.local" });

const starterProducts = [
  {
    slug: "notion-pack",
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
    slug: "lightroom-presets",
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
    slug: "resume-kit",
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

async function main() {
  const { getDb, schema } = await import("@/lib/db");
  const { hashPassword } = await import("@/lib/password");
  const { eq } = await import("drizzle-orm");
  const db = getDb();

  for (const p of starterProducts) {
    await db
      .insert(schema.products)
      .values(p)
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          name: p.name,
          tagline: p.tagline,
          priceCents: p.priceCents,
          currency: p.currency,
          image: p.image,
          features: p.features,
          updatedAt: new Date(),
        },
      });
    console.log(`✔ product ${p.slug}`);
  }

  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com")
    .trim()
    .toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  const [existing] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing) {
    console.log(`• admin ${email} already exists — password left unchanged`);
  } else {
    await db.insert(schema.users).values({
      email,
      passwordHash: await hashPassword(password),
      role: "ADMIN",
    });
    console.log(`✔ admin ${email} created`);
  }

  await db.$client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
