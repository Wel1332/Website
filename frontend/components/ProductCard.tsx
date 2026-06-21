"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { Product, formatPrice } from "@/shared/products";

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <article className="card">
      <div className="relative h-[180px] border-b border-border bg-surface-2">
        <Image
          src={product.image}
          alt={`Preview of the ${product.name}`}
          fill
          sizes="(max-width: 700px) 100vw, 360px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-[22px]">
        <h3 className="text-[1.18rem] font-semibold leading-[1.25] tracking-[-0.02em]">
          {product.name}
        </h3>
        <p className="mb-4 mt-2 text-[0.92rem] text-muted">{product.tagline}</p>
        <ul className="mb-5 flex list-none flex-col gap-2">
          {product.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-[0.88rem] text-muted"
            >
              <span className="mt-[0.42em] h-2.5 w-2.5 shrink-0 rounded-full bg-accent-soft shadow-[inset_0_0_0_1px_var(--color-accent)]" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-[18px]">
          <span className="font-display text-[1.5rem] font-bold tracking-[-0.02em]">
            {formatPrice(product.priceCents, product.currency)}
          </span>
          <button
            className="btn btn-primary"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                Loading…
              </>
            ) : (
              <>
                Buy now
                <ArrowRight size={16} strokeWidth={2} />
              </>
            )}
          </button>
        </div>
        {error && <p className="mt-2.5 text-[0.82rem] text-danger">{error}</p>}
      </div>
    </article>
  );
}
