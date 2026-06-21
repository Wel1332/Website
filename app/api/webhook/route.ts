// Thin routing layer — the real logic lives in /backend.
import { handleWebhook } from "@/backend/webhook";

// Stripe needs the raw request body to verify the signature.
export const runtime = "nodejs";

export const POST = handleWebhook;
