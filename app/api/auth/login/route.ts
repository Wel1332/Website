// Thin routing layer — the real logic lives in /backend.
import { handleLogin } from "@/backend/auth";

export const POST = handleLogin;
