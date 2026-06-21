import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <CheckCircle2 size={32} strokeWidth={1.75} />
      </span>
      <h1 className="mb-3.5 text-[2.6rem] font-bold tracking-[-0.03em]">
        Thank you!
      </h1>
      <p className="mb-7 max-w-[480px] text-muted">
        Your payment was successful. Check your email for the download link and
        receipt. If it doesn&apos;t arrive in a few minutes, check your spam
        folder or contact support.
      </p>
      <a className="btn btn-ghost" href="/">
        <ArrowLeft size={16} strokeWidth={2} />
        Back to store
      </a>
    </div>
  );
}
