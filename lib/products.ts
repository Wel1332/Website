import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import type { Product } from "@/shared/products";

/* Server-side catalogue reads. The storefront and checkout both go through
   here so "what's for sale" has exactly one definition: active rows. */

function toProduct(row: schema.DbProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    priceCents: row.priceCents,
    currency: row.currency,
    image: row.image,
    features: row.features,
    active: row.active,
  };
}

export async function listActiveProducts(): Promise<Product[]> {
  const rows = await getDb()
    .select()
    .from(schema.products)
    .where(eq(schema.products.active, true))
    .orderBy(asc(schema.products.createdAt));
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const [row] = await getDb()
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, id))
    .limit(1);
  return row ? toProduct(row) : null;
}
