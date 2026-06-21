import {
  ShieldCheck,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  MousePointerClick,
  CreditCard,
  Star,
  BadgeCheck,
  Mail,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { products, store } from "@/shared/products";
import ProductCard from "@/frontend/components/ProductCard";
import Reveal from "@/frontend/components/Reveal";

const stats = [
  { value: "2,400+", label: "Happy customers" },
  { value: "4.9/5", label: "Average rating" },
  { value: "12k+", label: "Downloads delivered" },
  { value: "14-day", label: "Money-back promise" },
];

const steps = [
  {
    icon: MousePointerClick,
    title: "Pick your product",
    body: "Browse the collection and choose the tool that fits your workflow.",
  },
  {
    icon: CreditCard,
    title: "Checkout securely",
    body: "Pay in seconds with Stripe. No account, no subscription, no hassle.",
  },
  {
    icon: Download,
    title: "Download instantly",
    body: "Get an email with your secure download link the moment you pay.",
  },
];

const testimonials = [
  {
    quote:
      "The Notion pack replaced five apps for me. Genuinely the best $29 I've spent this year.",
    name: "Maya R.",
    role: "Freelance designer",
  },
  {
    quote:
      "Downloaded the presets and my photos instantly looked like they belonged on a magazine cover.",
    name: "Daniel K.",
    role: "Travel photographer",
  },
  {
    quote:
      "Used the resume kit and landed three interviews in two weeks. Worth every cent.",
    name: "Priya S.",
    role: "Marketing lead",
  },
];

const navLink =
  "ml-[26px] text-[0.92rem] text-muted transition-colors hover:text-text";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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

export default function StorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4">
          <a
            className="font-display text-[1.28rem] font-bold tracking-[-0.03em]"
            href="#"
          >
            {store.brand}
          </a>
          <nav className="flex items-center">
            <a className={navLink} href="#products">
              Products
            </a>
            <a className={navLink} href="#faq">
              FAQ
            </a>
            <a
              className="ml-[26px] rounded-full border border-border-hover px-4 py-2 font-display text-[0.92rem] font-semibold text-text transition-colors hover:border-accent hover:bg-accent-soft"
              href="#products"
            >
              Browse
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="mx-auto max-w-[820px] px-6 pb-[72px] pt-16 text-center sm:pt-[88px]">
        <span className="mb-[26px] inline-flex items-center gap-[7px] rounded-full border border-border bg-surface px-3.5 py-1.5 font-display text-[0.8rem] font-medium text-muted">
          <Sparkles size={14} strokeWidth={2} className="text-accent" />
          Premium digital products
        </span>
        <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-bold leading-[1.04] tracking-[-0.04em]">
          {store.brand} — digital products,{" "}
          <span className="text-accent">delivered instantly.</span>
        </h1>
        <p className="mx-auto mt-[22px] max-w-[560px] text-[clamp(1.05rem,2.2vw,1.25rem)] text-muted">
          {store.blurb}
        </p>
        <div className="mt-[34px] flex flex-wrap justify-center gap-3">
          <a className="btn btn-primary" href="#products">
            Browse products
            <ArrowRight size={16} strokeWidth={2} />
          </a>
          <a className="btn btn-ghost" href="#how">
            How it works
          </a>
        </div>
        <ul className="mt-[34px] flex list-none flex-wrap justify-center gap-x-6 gap-y-3">
          <li className="inline-flex items-center gap-2 text-[0.85rem] text-muted">
            <ShieldCheck size={16} strokeWidth={1.75} className="text-accent" />
            Secure checkout by Stripe
          </li>
          <li className="inline-flex items-center gap-2 text-[0.85rem] text-muted">
            <Download size={16} strokeWidth={1.75} className="text-accent" />
            Instant download
          </li>
          <li className="inline-flex items-center gap-2 text-[0.85rem] text-muted">
            <RotateCcw size={16} strokeWidth={1.75} className="text-accent" />
            Money-back guarantee
          </li>
        </ul>
      </section>

      <Reveal as="section" className="mx-auto mt-2 max-w-[1120px] px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-border bg-border sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 bg-bg px-3 py-7 text-center"
            >
              <span className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.03em]">
                {s.value}
              </span>
              <span className="text-[0.85rem] text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal
        as="section"
        id="products"
        className="mx-auto max-w-[1120px] px-6 pb-[72px] pt-14"
      >
        <div className="mx-auto mb-10 max-w-[560px] text-center">
          <h2 className="text-[clamp(1.7rem,4vw,2.4rem)] font-bold tracking-[-0.03em]">
            Featured products
          </h2>
          <p className="mt-3 text-[1.02rem] text-muted">
            Hand-crafted tools and templates — buy once, download instantly,
            keep them forever.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[22px]">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>

      <Reveal
        as="section"
        id="how"
        className="mx-auto max-w-[1120px] px-6 py-16"
      >
        <div className="mx-auto mb-10 max-w-[560px] text-center">
          <h2 className="text-[clamp(1.7rem,4vw,2.4rem)] font-bold tracking-[-0.03em]">
            How it works
          </h2>
          <p className="mt-3 text-[1.02rem] text-muted">
            From browse to download in under a minute — no account required.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {steps.map((s, i) => (
            <div key={s.title} className="panel relative px-6 py-7">
              <span className="absolute right-6 top-[22px] font-display text-[2.4rem] font-bold leading-none text-surface-2">
                {i + 1}
              </span>
              <span className="mb-[18px] inline-flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-accent-soft text-accent">
                <s.icon size={22} strokeWidth={1.75} />
              </span>
              <h3 className="mb-2 text-[1.12rem] font-semibold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="text-[0.93rem] text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal
        as="section"
        className="mx-auto max-w-[1120px] px-6 pb-[72px] pt-12"
      >
        <div className="mx-auto mb-10 max-w-[560px] text-center">
          <h2 className="text-[clamp(1.7rem,4vw,2.4rem)] font-bold tracking-[-0.03em]">
            Loved by creators
          </h2>
          <p className="mt-3 text-[1.02rem] text-muted">
            Join thousands who ship faster with Pixelforge products.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {testimonials.map((t) => (
            <figure key={t.name} className="panel flex flex-col gap-3.5 p-6">
              <div
                className="flex gap-[3px] text-accent"
                role="img"
                aria-label="Rated 5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-[1rem] leading-[1.55]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex flex-col">
                <span className="font-display font-semibold tracking-[-0.01em]">
                  {t.name}
                </span>
                <span className="text-[0.85rem] text-muted">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="mx-auto max-w-[1120px] px-6 pb-2 pt-6">
        <div className="flex flex-col items-start gap-[18px] rounded-[18px] border border-border p-8 [background:linear-gradient(120deg,var(--color-accent-soft),transparent_55%),var(--color-surface)] sm:flex-row sm:items-center sm:gap-6">
          <span className="inline-flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <BadgeCheck size={28} strokeWidth={1.75} />
          </span>
          <div className="flex-1">
            <h2 className="text-[clamp(1.3rem,3vw,1.7rem)] font-bold tracking-[-0.03em]">
              Try it risk-free for 14 days
            </h2>
            <p className="mt-1.5 text-[0.96rem] text-muted">
              If a product isn&apos;t the right fit, email us within 14 days for
              a full refund — no forms, no questions, no hard feelings.
            </p>
          </div>
          <a className="btn btn-primary w-full shrink-0 sm:w-auto" href="#products">
            Browse products
            <ArrowRight size={16} strokeWidth={2} />
          </a>
        </div>
      </Reveal>

      <Reveal
        as="section"
        id="faq"
        className="mx-auto max-w-[780px] px-6 pb-[72px] pt-12"
      >
        <h2 className="mb-6 text-[clamp(1.6rem,3.5vw,2.1rem)] font-bold tracking-[-0.03em]">
          FAQ
        </h2>
        {[
          {
            q: "How do I receive my product?",
            a: "Right after checkout you get an email with a secure download link. No account needed.",
          },
          {
            q: "Is payment secure?",
            a: "Yes. Payments are processed by Stripe. We never see or store your card details.",
          },
          {
            q: "What's your refund policy?",
            a: "If a product isn't what you expected, email us within 14 days for a full refund.",
          },
        ].map((item) => (
          <details
            key={item.q}
            className="panel group mb-3 px-5 py-[18px] transition-colors open:border-border-hover"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-[1rem] font-semibold tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus
                size={20}
                strokeWidth={2}
                className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <p className="mt-3 text-[0.95rem] text-muted">{item.a}</p>
          </details>
        ))}
      </Reveal>
      </main>

      <footer className="mt-6 border-t border-border">
        <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-10 px-6 pb-10 pt-14">
          <div className="max-w-[320px]">
            <span className="mb-3 inline-block font-display text-[1.28rem] font-bold tracking-[-0.03em]">
              {store.brand}
            </span>
            <p className="text-[0.92rem] text-muted">{store.blurb}</p>
            <span className="mt-4 inline-flex items-center gap-[7px] text-[0.82rem] text-faint">
              <ShieldCheck size={14} strokeWidth={1.75} className="text-accent" />
              Secure payments by Stripe
            </span>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="mb-1 font-display text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-faint">
                Shop
              </h4>
              <a className="text-[0.92rem] text-muted transition-colors hover:text-text" href="#products">
                Products
              </a>
              <a className="text-[0.92rem] text-muted transition-colors hover:text-text" href="#how">
                How it works
              </a>
              <a className="text-[0.92rem] text-muted transition-colors hover:text-text" href="#faq">
                FAQ
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="mb-1 font-display text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-faint">
                Support
              </h4>
              <a
                className="inline-flex items-center gap-1.5 text-[0.92rem] text-muted transition-colors hover:text-text"
                href={`mailto:${store.supportEmail}`}
              >
                <Mail size={13} strokeWidth={1.75} />
                {store.supportEmail}
              </a>
              <Link className="text-[0.92rem] text-muted transition-colors hover:text-text" href="/refund">
                Refund policy
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="mb-1 font-display text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-faint">
                Legal
              </h4>
              <Link className="text-[0.92rem] text-muted transition-colors hover:text-text" href="/terms">
                Terms of Service
              </Link>
              <Link className="text-[0.92rem] text-muted transition-colors hover:text-text" href="/privacy">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-6 py-5 text-center sm:flex-row sm:text-left">
          <span className="text-[0.82rem] text-faint">
            © {new Date().getFullYear()} {store.brand} · All rights reserved.
          </span>
          <span className="flex gap-4 text-[0.82rem] text-faint">
            <Link className="transition-colors hover:text-text" href="/terms">
              Terms
            </Link>
            <Link className="transition-colors hover:text-text" href="/privacy">
              Privacy
            </Link>
            <Link className="transition-colors hover:text-text" href="/refund">
              Refunds
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
