import { z } from "zod";

export const productQuerySchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  sort: z
    .enum(["price_asc", "price_desc", "newest", "name_asc"])
    .default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
});

export const productSlugSchema = z.object({
  slug: z.string().min(1),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
