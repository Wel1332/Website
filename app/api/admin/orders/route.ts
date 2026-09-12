// Thin routing layer — the real logic lives in /backend.
import { handleListOrders } from "@/backend/admin-orders";

export const GET = handleListOrders;
