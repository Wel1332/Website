// Thin routing layer — the real logic lives in /backend.
import { handleMe } from "@/backend/auth";

export const GET = handleMe;
