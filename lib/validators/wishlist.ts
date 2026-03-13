import { z } from "zod";

export const wishlistSchema = z.object({
  variantId: z.string().min(1),
});

export type WishlistInput = z.infer<typeof wishlistSchema>;
