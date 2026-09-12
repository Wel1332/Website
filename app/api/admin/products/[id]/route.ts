// Thin routing layer — the real logic lives in /backend.
import {
  handleDeleteProduct,
  handleUpdateProduct,
} from "@/backend/admin-products";

export const PATCH = handleUpdateProduct;
export const DELETE = handleDeleteProduct;
