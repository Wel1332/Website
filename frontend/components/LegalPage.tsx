import Link from "next/link";
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
    <div className="mx-auto max-w-[780px] px-6 pb-24 pt-12">
      <Link
        href="/"
        className="link font-mono text-[0.72rem] uppercase tracking-[0.16em]"
      >
        <span aria-hidden="true">←</span> Back to {store.brand}
      </Link>

      <h1 className="mt-10 text-[clamp(2rem,5vw,2.9rem)]">{title}</h1>

      <div className="mt-6 flex items-center gap-6">
        <span className="label shrink-0">Last updated {updated}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {intro && (
        <p className="mt-8 text-[1.05rem] leading-relaxed text-muted">{intro}</p>
      )}

      <div className="mt-12 flex flex-col gap-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-[1.3rem]">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-14 border-t border-border pt-6 text-[0.95rem] text-muted">
        Questions about this policy? Write to{" "}
        <a className="link text-text" href={`mailto:${store.supportEmail}`}>
          {store.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
