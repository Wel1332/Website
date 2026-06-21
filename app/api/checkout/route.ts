// Thin routing layer — the real logic lives in /backend.
import { handleCheckout } from "@/backend/checkout";

export const POST = handleCheckout;
