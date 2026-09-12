"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, formatPrice } from "@/shared/products";

/* A catalogue plate: number, preview, specification, price. Plates alternate
   sides down the page so the eye has somewhere to travel. */
export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flipped = index % 2 === 1;
  const plate = String(index + 1).padStart(2, "0");

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <article className="group border-t border-border py-12 first:border-t-0 first:pt-0 md:py-14">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <span className="font-mono text-[0.8rem] font-medium tracking-[0.14em] text-accent">
          № {plate}
        </span>
        <span className="label">Instant download</span>
      </div>

      <div className="grid items-start gap-9 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-14">
        <div
          className={`relative aspect-[5/3] overflow-hidden border border-border bg-surface-2 transition-colors duration-300 group-hover:border-border-hover ${
            flipped ? "md:order-2" : ""
          }`}
        >
          <Image
            src={product.image}
            alt={`Preview of the ${product.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className={flipped ? "md:order-1" : ""}>
          <h3 className="text-[clamp(1.6rem,3.4vw,2.15rem)]">{product.name}</h3>
          <p className="mt-3 max-w-[46ch] text-[1.02rem] text-muted">
            {product.tagline}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="label">What&apos;s inside</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <ul className="mt-4 flex list-none flex-col gap-2.5">
            {product.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-[0.97rem] text-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.62em] h-[5px] w-[5px] shrink-0 bg-accent"
                />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-end justify-between gap-5 border-t border-border pt-6">
            <div className="flex flex-col">
              <span className="font-mono text-[2rem] font-medium leading-none tracking-[-0.03em]">
                {formatPrice(product.priceCents, product.currency)}
              </span>
              <span className="label mt-2">
                One payment · {product.currency.toUpperCase()}
              </span>
            </div>
            <button
              className="btn btn-brass"
              onClick={handleBuy}
              disabled={loading}
            >
              {loading ? "Opening Stripe…" : "Buy this"}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 border-l-2 border-danger pl-3 font-mono text-[0.8rem] text-danger"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
