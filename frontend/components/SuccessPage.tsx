import { store } from "@/shared/products";

export default function SuccessPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-[640px] flex-col justify-center px-6 py-20">
      <span className="label">Order complete</span>

      <h1 className="mt-6 text-[clamp(2.2rem,6vw,3.2rem)] leading-[1]">
        Paid.{" "}
        <span className="font-body font-normal italic tracking-[-0.02em] text-accent">
          Check your inbox.
        </span>
      </h1>

      <p className="mt-6 max-w-[52ch] text-[1.05rem] text-muted">
        Your download link and receipt are on their way. The files are yours to
        keep — save them somewhere you&apos;ll find them again.
      </p>

      <div className="mt-9">
        <a className="btn btn-quiet" href="/">
          <span aria-hidden="true">←</span>
          Back to the catalogue
        </a>
      </div>

      <p className="mt-14 border-t border-border pt-6 text-[0.95rem] text-muted">
        Nothing after a few minutes? Check your spam folder, then write to{" "}
        <a className="link text-text" href={`mailto:${store.supportEmail}`}>
          {store.supportEmail}
        </a>{" "}
        and we&apos;ll send it again.
      </p>
    </div>
  );
}
