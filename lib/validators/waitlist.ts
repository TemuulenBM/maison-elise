import { z } from "zod";

export const waitlistSchema = z.object({
  productId: z.string().min(1),
  email: z.string().email("Зөв имэйл хаяг оруулна уу"),
  name: z.string().max(100).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
