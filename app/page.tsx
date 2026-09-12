// Thin routing layer — the real UI lives in /frontend.
import StorePage from "@/frontend/components/StorePage";
import { listActiveProducts } from "@/lib/products";

// The catalogue is read from Postgres on each request, so this page can't be
// prerendered at build time.
export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await listActiveProducts();
  return <StorePage products={products} />;
}
