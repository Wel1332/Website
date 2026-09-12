// Thin routing layer — the real logic lives in /backend.
import {
  handleCreateProduct,
  handleListProducts,
} from "@/backend/admin-products";

export const GET = handleListProducts;
export const POST = handleCreateProduct;
