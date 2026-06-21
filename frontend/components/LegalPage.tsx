import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { store } from "@/shared/products";

export interface LegalSection {
  heading: string;
  body: string[];
}

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-[760px] px-6 pb-24 pt-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[0.9rem] text-muted transition-colors hover:text-text"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to {store.brand}
      </Link>

      <h1 className="mt-8 text-[clamp(2rem,5vw,2.8rem)] font-bold tracking-[-0.03em]">
        {title}
      </h1>
      <p className="mt-3 text-[0.9rem] text-faint">Last updated {updated}</p>

      {intro && (
        <p className="mt-6 leading-relaxed text-muted">{intro}</p>
      )}

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em]">
              {s.heading}
            </h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-border pt-6 text-[0.85rem] text-faint">
        Questions about this policy? Contact{" "}
        <a
          className="text-text underline underline-offset-4 hover:text-accent"
          href={`mailto:${store.supportEmail}`}
        >
          {store.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
