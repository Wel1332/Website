// Thin routing layer — the real UI lives in /frontend.
import type { Metadata } from "next";
import ProductsManager from "@/frontend/components/admin/ProductsManager";

export const metadata: Metadata = { title: "Products" };

export default function AdminProductsPage() {
  return <ProductsManager />;
}
