import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, "Нэр шаардлагатай"),
  line1: z.string().min(1, "Хаяг шаардлагатай"),
  line2: z.string().optional(),
  city: z.string().min(1, "Хот шаардлагатай"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Шуудангийн код шаардлагатай"),
  country: z.string().min(2).max(2), // ISO 3166-1 alpha-2
  phone: z.string().optional(),
});

export const checkoutIntentSchema = z.object({
  cartId: z.string().min(1),
  shippingAddress: shippingAddressSchema,
  giftPackaging: z.boolean().default(false),
  giftNote: z.string().max(500).optional(),
  idempotencyKey: z.string().min(1),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutIntentInput = z.infer<typeof checkoutIntentSchema>;
