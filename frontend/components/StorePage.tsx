import Link from "next/link";
import { store, type Product } from "@/shared/products";
import ProductCard from "@/frontend/components/ProductCard";
import Hallmark from "@/frontend/components/Hallmark";
import Reveal from "@/frontend/components/Reveal";

const promises = ["Stripe checkout", "Instant download", "14-day refund"];

const steps = [
  {
    title: "Pick a tool",
    body: "Every listing says what's inside, what it opens in, and what it costs. No cart, no account, no upsell on the way out.",
  },
  {
    title: "Pay through Stripe",
    body: "Card details go straight to Stripe and never touch this site. One payment — there's nothing to cancel later.",
  },
  {
    title: "Download it",
    body: "The link reaches your inbox the moment the payment clears. The files are yours, and so are the updates.",
  },
];

const testimonials = [
  {
    quote:
      "I bought the Notion pack on a Sunday and had my whole freelance admin in one place by Monday. Haven't opened the other five apps since.",
    name: "Maya R.",
    role: "Freelance designer",
  },
  {
    quote:
      "Forty presets, and about twelve of them do almost all my work now. The install guide had me editing on my phone in two minutes.",
    name: "Daniel K.",
    role: "Travel photographer",
  },
  {
    quote:
      "Rewrote my resume with the kit on a Tuesday. Three callbacks by the end of the following week — after months of nothing.",
    name: "Priya S.",
    role: "Marketing lead",
  },
];

const faqs = [
  {
    q: "How do I get the files?",
    a: "Straight after checkout you land on a confirmation page, and an email arrives with your download link. There's no account to create and no waiting on a human.",
  },
  {
    q: "Is paying safe?",
    a: "Stripe handles the payment on its own hosted page. Your card number never reaches this site, so there's nothing here for anyone to steal.",
  },
  {
    q: "Can I use these in paid client work?",
    a: "Yes. Use them in your own projects and in work you're paid for. The one thing you can't do is resell or redistribute the files themselves.",
  },
  {
    q: "What if it isn't what I expected?",
    a: `Email ${store.supportEmail} within 14 days and we refund it in full. You don't need to explain why.`,
  },
];

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/* Section heads share one structure: a mono label, a rule that measures the
   width of the page, and an optional note carrying real data on the right. */
function SectionHead({
  label,
  title,
  note,
}: {
  label: string;
  title?: string;
  note?: string;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-6">
        <span className="label shrink-0">{label}</span>
        <span className="h-px flex-1 bg-border" />
        {note && <span className="label shrink-0">{note}</span>}
      </div>
      {title && (
        <h2 className="mt-7 max-w-[20ch] text-[clamp(1.9rem,4.4vw,2.9rem)]">
          {title}
        </h2>
      )}
    </div>
  );
}

export default function StorePage({ products }: { products: Product[] }) {
  const plateRange = `№ 01–${String(products.length).padStart(2, "0")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store.brand,
    description: store.blurb,
    url: siteUrl,
    email: store.supportEmail,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital products",
      itemListElement: products.map((p) => ({
        "@type": "Product",
        name: p.name,
        description: p.tagline,
        image: `${siteUrl}${p.image}`,
        offers: {
          "@type": "Offer",
          price: (p.priceCents / 100).toFixed(2),
          priceCurrency: p.currency.toUpperCase(),
          availability: "https://schema.org/InStock",
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:uppercase focus:tracking-[0.14em] focus:text-bg"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-6 py-4">
          <a
            className="font-display text-[1.2rem] font-extrabold tracking-[-0.04em]"
            href="#"
          >
            {store.brand}
          </a>
          <nav className="flex items-center gap-7 font-mono text-[0.72rem] uppercase tracking-[0.16em]">
            <a className="link hidden sm:inline" href="#catalogue">
              Catalogue
            </a>
            <a className="link hidden sm:inline" href="#delivery">
              Delivery
            </a>
            <a className="link" href="#questions">
              Questions
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="outline-none">
        <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
          <div className="grid items-center gap-14 md:grid-cols-[1fr_auto] md:gap-20">
            <div>
              <p className="label animate-rise">
                {products.length} tools · nothing to subscribe to
              </p>

              <h1 className="mt-7 text-[clamp(2.8rem,8vw,5.2rem)] leading-[0.95]">
                <span className="animate-rise block [animation-delay:80ms]">
                  Made once.
                </span>
                <span className="animate-rise block font-body font-normal italic tracking-[-0.02em] text-accent [animation-delay:160ms]">
                  Yours forever.
                </span>
              </h1>

              <p className="animate-rise mt-8 max-w-[52ch] text-[1.08rem] text-muted [animation-delay:240ms]">
                {store.brand} keeps a short catalogue of finished digital tools.
                Pay through Stripe and the download link is in your inbox before
                you close the tab — no account, no subscription, nothing that
                renews.
              </p>

              <div className="animate-rise mt-10 flex flex-wrap gap-3 [animation-delay:320ms]">
                <a className="btn btn-brass" href="#catalogue">
                  Browse the catalogue
                  <span aria-hidden="true">→</span>
                </a>
                <a className="btn btn-quiet" href="#delivery">
                  How delivery works
                </a>
              </div>
            </div>

            <Hallmark
              brand={store.brand}
              className="animate-strike w-[168px] justify-self-start md:w-[248px] md:justify-self-end"
            />
          </div>

          <ul className="animate-rise mt-16 flex list-none flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 [animation-delay:400ms]">
            {promises.map((p, i) => (
              <li
                key={p}
                className={`label ${i > 0 ? "border-l border-border pl-6" : ""}`}
              >
                {p}
              </li>
            ))}
          </ul>
        </section>

        <Reveal
          as="section"
          id="catalogue"
          className="mx-auto max-w-[1180px] px-6 pt-12"
        >
          <SectionHead
            label="Catalogue"
            title="Finished tools, not works in progress."
            note={plateRange}
          />
          <div>
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </Reveal>

        <Reveal
          as="section"
          id="delivery"
          className="mt-20 border-y border-border bg-surface py-20"
        >
          <div className="mx-auto max-w-[1180px] px-6">
            <SectionHead
              label="Delivery"
              title="From click to file in under a minute."
            />
            <ol className="grid list-none gap-10 md:grid-cols-3 md:gap-12">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className="md:border-l md:border-border md:pl-10 md:first:border-l-0 md:first:pl-0"
                >
                  <span className="font-mono text-[0.8rem] font-medium tracking-[0.14em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[1.3rem]">{s.title}</h3>
                  <p className="mt-3 text-[0.97rem] text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal as="section" className="mx-auto max-w-[1180px] px-6 py-20">
          <SectionHead label="From buyers" />
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="md:border-l md:border-border md:pl-10 md:first:border-l-0 md:first:pl-0"
              >
                <blockquote className="text-[1.05rem] leading-[1.6]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block font-display text-[0.98rem] font-semibold tracking-[-0.02em]">
                    {t.name}
                  </span>
                  <span className="label mt-1.5 block">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mx-auto max-w-[1180px] px-6 pb-20">
          <div className="flex flex-col gap-9 border-t border-border pt-12 md:flex-row md:items-end md:justify-between md:gap-16">
            <div className="max-w-[54ch]">
              <span className="label">Guarantee</span>
              <h2 className="mt-5 text-[clamp(1.7rem,3.6vw,2.4rem)]">
                Fourteen days to change your mind.
              </h2>
              <p className="mt-4 text-[1.02rem] text-muted">
                Email us inside two weeks and we refund the whole amount. No
                form to fill in, no reason required, no follow-up sequence
                asking you to reconsider.
              </p>
            </div>
            <a className="btn btn-brass shrink-0" href="#catalogue">
              Browse the catalogue
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>

        <Reveal
          as="section"
          id="questions"
          className="mx-auto max-w-[1180px] px-6 pb-24"
        >
          <div className="grid gap-10 border-t border-border pt-12 md:grid-cols-[210px_1fr] md:gap-16">
            <div>
              <span className="label">Questions</span>
              <p className="mt-4 max-w-[26ch] text-[0.97rem] text-muted">
                Anything else, write to{" "}
                <a
                  className="link text-text"
                  href={`mailto:${store.supportEmail}`}
                >
                  {store.supportEmail}
                </a>
                .
              </p>
            </div>
            <div>
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-border first:border-t first:border-border"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[1.08rem] font-semibold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-[1.15rem] font-medium text-accent transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[68ch] pb-6 text-[0.99rem] text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <span className="font-display text-[1.2rem] font-extrabold tracking-[-0.04em]">
              {store.brand}
            </span>
            <p className="mt-4 max-w-[34ch] text-[0.97rem] text-muted">
              {store.blurb}
            </p>
            <span className="label mt-6 block">Payments secured by Stripe</span>
          </div>

          <div>
            <h4 className="label">Shop</h4>
            <ul className="mt-4 flex list-none flex-col items-start gap-2.5 text-[0.95rem]">
              <li>
                <a className="link" href="#catalogue">
                  Catalogue
                </a>
              </li>
              <li>
                <a className="link" href="#delivery">
                  Delivery
                </a>
              </li>
              <li>
                <a className="link" href="#questions">
                  Questions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="label">Support</h4>
            <ul className="mt-4 flex list-none flex-col items-start gap-2.5 text-[0.95rem]">
              <li>
                <a className="link" href={`mailto:${store.supportEmail}`}>
                  {store.supportEmail}
                </a>
              </li>
              <li>
                <Link className="link" href="/refund">
                  Refund policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="label">Legal</h4>
            <ul className="mt-4 flex list-none flex-col items-start gap-2.5 text-[0.95rem]">
              <li>
                <Link className="link" href="/terms">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link className="link" href="/privacy">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left">
            <span className="label">
              © {new Date().getFullYear()} {store.brand}
            </span>
            <span className="label">All rights reserved</span>
          </div>
        </div>
      </footer>
    </>
  );
}
