import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const productCreateSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase kebab-case (letters, numbers, single hyphens)."
    ),
  name: z.string().trim().min(1).max(200),
  tagline: z.string().trim().min(1).max(300),
  priceCents: z.number().int().positive(),
  currency: z.string().trim().toLowerCase().length(3),
  image: z.string().trim().min(1).max(500),
  features: z.array(z.string().trim().min(1).max(200)).max(50),
  active: z.boolean(),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

/** Flattens Zod issues into `{ "field.path": "message" }` for API responses. */
export function formatZodIssues(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
