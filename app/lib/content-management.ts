import { z } from "zod";
import { articleSectionSchema } from "./blog-schema";

const slugSchema = z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum);

export const managedProductOverrideSchema = z.object({
  slug: slugSchema,
  name: text(2, 120),
  eyebrow: text(2, 120),
  description: text(20, 600),
  benefit: text(10, 400),
  uses: z.array(text(2, 80)).min(1).max(12),
});

export const managedArticleOverrideSchema = z.object({
  slug: slugSchema,
  title: text(8, 180),
  description: text(20, 500),
  directAnswer: text(40, 1200),
  sections: z.array(articleSectionSchema).min(2),
});

export type ManagedProductOverride = z.infer<typeof managedProductOverrideSchema>;
export type ManagedArticleOverride = z.infer<typeof managedArticleOverrideSchema>;
export type ManagedContentType = "products" | "articles";

export function parseManagedProductOverride(value: unknown) {
  return managedProductOverrideSchema.parse(value);
}

export function parseManagedArticleOverride(value: unknown) {
  return managedArticleOverrideSchema.parse(value);
}

export function isManagedContentType(value: string | null): value is ManagedContentType {
  return value === "products" || value === "articles";
}

export function parseManagedContentOverride(type: ManagedContentType, value: unknown) {
  return type === "products"
    ? parseManagedProductOverride(value)
    : parseManagedArticleOverride(value);
}
