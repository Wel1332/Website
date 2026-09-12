"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { formatPrice } from "@/shared/products";

/* Product rows as the admin API returns them (timestamps arrive as strings). */
interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  currency: string;
  image: string;
  features: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  slug: string;
  name: string;
  tagline: string;
  priceDollars: string;
  currency: string;
  image: string;
  featuresText: string;
  active: boolean;
}

const emptyForm: FormState = {
  slug: "",
  name: "",
  tagline: "",
  priceDollars: "",
  currency: "usd",
  image: "/images/",
  featuresText: "",
  active: true,
};

function toForm(p: AdminProduct): FormState {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    priceDollars: (p.priceCents / 100).toFixed(2),
    currency: p.currency,
    image: p.image,
    featuresText: p.features.join("\n"),
    active: p.active,
  };
}

/* Dollars in the form, cents over the wire — the API and Stripe only ever
   see integers. */
function toPayload(f: FormState) {
  return {
    slug: f.slug.trim(),
    name: f.name.trim(),
    tagline: f.tagline.trim(),
    priceCents: Math.round(Number.parseFloat(f.priceDollars) * 100),
    currency: f.currency.trim().toLowerCase(),
    image: f.image.trim(),
    features: f.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    active: f.active,
  };
}

type Mode = { kind: "closed" } | { kind: "create" } | { kind: "edit"; id: string };

export default function ProductsManager() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>({ kind: "closed" });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't load products.");
      setProducts(data.products);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Couldn't load products.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(emptyForm);
    setFormError(null);
    setFieldErrors({});
    setMode({ kind: "create" });
  }

  function openEdit(p: AdminProduct) {
    setForm(toForm(p));
    setFormError(null);
    setFieldErrors({});
    setMode({ kind: "edit", id: p.id });
  }

  function close() {
    setMode({ kind: "closed" });
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode.kind === "closed") return;
    setSaving(true);
    setFormError(null);
    setFieldErrors({});

    const payload = toPayload(form);
    if (!Number.isFinite(payload.priceCents) || payload.priceCents <= 0) {
      setFieldErrors({ priceCents: "Enter a price greater than zero." });
      setSaving(false);
      return;
    }

    const url =
      mode.kind === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${mode.id}`;
    try {
      const res = await fetch(url, {
        method: mode.kind === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fields) setFieldErrors(data.fields);
        throw new Error(data.error || "Save failed.");
      }
      await load();
      close();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: AdminProduct) {
    if (!window.confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    setRowError(null);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      if (mode.kind === "edit" && mode.id === p.id) close();
      await load();
    } catch (err) {
      setRowError({
        id: p.id,
        message: err instanceof Error ? err.message : "Delete failed.",
      });
    }
  }

  return (
    <>
      <div className="flex items-center gap-6">
        <span className="label shrink-0">Products</span>
        <span className="h-px flex-1 bg-border" />
        {products && (
          <span className="label shrink-0">
            {products.length} {products.length === 1 ? "listing" : "listings"}
          </span>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
        <h1 className="text-[clamp(1.8rem,4vw,2.5rem)]">Catalogue</h1>
        <button type="button" className="btn btn-brass" onClick={openCreate}>
          New product
          <span aria-hidden="true">+</span>
        </button>
      </div>

      {mode.kind !== "closed" && (
        <form
          onSubmit={handleSubmit}
          className="mt-10 border border-border bg-surface p-6 md:p-8"
        >
          <div className="flex items-center gap-6">
            <span className="label shrink-0">
              {mode.kind === "create" ? "New product" : "Edit product"}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Name" error={fieldErrors.name}>
              <input
                className="field"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
            <Field label="Slug" hint="lowercase-kebab-case" error={fieldErrors.slug}>
              <input
                className="field"
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
              />
            </Field>
            <Field label="Tagline" error={fieldErrors.tagline} className="md:col-span-2">
              <input
                className="field"
                required
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </Field>
            <Field label="Price (dollars)" error={fieldErrors.priceCents}>
              <input
                className="field"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                required
                value={form.priceDollars}
                onChange={(e) => set("priceDollars", e.target.value)}
              />
            </Field>
            <Field label="Currency" hint="3-letter code" error={fieldErrors.currency}>
              <input
                className="field"
                required
                maxLength={3}
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
              />
            </Field>
            <Field
              label="Image path"
              hint="a file under /public"
              error={fieldErrors.image}
              className="md:col-span-2"
            >
              <input
                className="field"
                required
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </Field>
            <Field
              label="Features"
              hint="one per line"
              error={fieldErrors.features}
              className="md:col-span-2"
            >
              <textarea
                className="field min-h-[7.5rem]"
                value={form.featuresText}
                onChange={(e) => set("featuresText", e.target.value)}
              />
            </Field>
            <label className="flex cursor-pointer items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={form.active}
                onChange={(e) => set("active", e.target.checked)}
              />
              <span className="text-[0.95rem]">
                Active{" "}
                <span className="text-muted">— shown on the storefront and purchasable</span>
              </span>
            </label>
          </div>

          {formError && (
            <p
              role="alert"
              className="mt-6 border-l-2 border-danger pl-3 font-mono text-[0.8rem] text-danger"
            >
              {formError}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className="btn btn-brass" disabled={saving}>
              {saving ? "Saving…" : mode.kind === "create" ? "Create product" : "Save changes"}
            </button>
            <button type="button" className="btn btn-quiet" onClick={close} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-12 overflow-x-auto">
        {loadError && (
          <p role="alert" className="border-l-2 border-danger pl-3 font-mono text-[0.8rem] text-danger">
            {loadError}
          </p>
        )}
        {!loadError && products === null && (
          <p className="label">Loading…</p>
        )}
        {products && products.length === 0 && (
          <p className="text-muted">No products yet. Create the first one above.</p>
        )}
        {products && products.length > 0 && (
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="label py-3 pr-4 font-medium">Name</th>
                <th className="label py-3 pr-4 font-medium">Slug</th>
                <th className="label py-3 pr-4 text-right font-medium">Price</th>
                <th className="label py-3 pr-4 font-medium">Status</th>
                <th className="label py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border align-top">
                  <td className="py-4 pr-4">
                    <span className="font-display font-semibold tracking-[-0.02em]">{p.name}</span>
                    <span className="mt-1 block max-w-[40ch] text-[0.9rem] text-muted">{p.tagline}</span>
                    {rowError?.id === p.id && (
                      <span role="alert" className="mt-2 block font-mono text-[0.75rem] text-danger">
                        {rowError.message}
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-4 font-mono text-[0.85rem] text-muted">{p.slug}</td>
                  <td className="py-4 pr-4 text-right font-mono text-[0.95rem]">
                    {formatPrice(p.priceCents, p.currency)}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`label ${p.active ? "text-accent" : ""}`}>
                      {p.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono text-[0.72rem] uppercase tracking-[0.16em]">
                    <button type="button" className="link cursor-pointer bg-transparent p-0" onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link ml-5 cursor-pointer bg-transparent p-0 hover:text-danger"
                      onClick={() => handleDelete(p)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Field({
  label,
  hint,
  error,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="flex items-baseline justify-between gap-4">
        <span className="label">{label}</span>
        {hint && <span className="font-mono text-[0.7rem] text-faint">{hint}</span>}
      </span>
      {children}
      {error && (
        <span className="font-mono text-[0.75rem] text-danger">{error}</span>
      )}
    </label>
  );
}
