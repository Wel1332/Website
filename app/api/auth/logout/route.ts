// Thin routing layer — the real logic lives in /backend.
import { handleLogout } from "@/backend/auth";

export const POST = handleLogout;
