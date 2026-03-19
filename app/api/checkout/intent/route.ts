import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutIntentSchema } from "@/lib/validators/order";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = checkoutIntentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { cartId, shippingAddress, giftPackaging, giftNote, idempotencyKey } =
    parsed.data;

  // Check for authenticated user (null for guest checkout)
  let authUserId: string | null = null;
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    authUserId = user?.id ?? null;
  } catch {
    // Auth unavailable — guest checkout
  }

  // Fetch cart with items
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { select: { basePrice: true, status: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty or not found" },
      { status: 400 }
    );
  }

  // Pessimistic lock + stock check + order create — all within a single transaction
  // SELECT FOR UPDATE serializes concurrent checkout requests
  type VariantRow = { id: string; stock_quantity: number; reserved: number };

  let order: { id: string };
  let totalAmount: number;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Acquire pessimistic lock on variants
      const variantIds = cart.items.map((item) => item.variantId);
      const lockedVariants = await tx.$queryRawUnsafe<VariantRow[]>(
        `SELECT id, stock_quantity, reserved
         FROM product_variants
         WHERE id = ANY($1::uuid[])
         FOR UPDATE`,
        variantIds
      );

      const variantMap = new Map(lockedVariants.map((v) => [v.id, v]));

      // 2. Validate stock and status (safe after lock)
      for (const item of cart.items) {
        const variant = variantMap.get(item.variantId);
        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }

        const available = variant.stock_quantity - variant.reserved;
        if (item.quantity > available) {
          throw new Error(
            `Insufficient stock for ${item.variant.product.name}|||${item.variantId}|||${available}`
          );
        }

        if (item.variant.product.status !== "ACTIVE") {
          throw new Error(
            `Product ${item.variant.product.name} is no longer available`
          );
        }
      }

      // 3. Calculate server-side total amount
      const amount = cart.items.reduce((sum, item) => {
        const price =
          item.variant.priceOverride ?? item.variant.product.basePrice;
        return sum + price * item.quantity;
      }, 0);

      // 4. Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: authUserId ?? cart.userId ?? "00000000-0000-0000-0000-000000000000",
          status: "PENDING",
          totalAmount: amount,
          paymentIntentId: "", // Will be updated after receiving from Stripe
          shippingAddress: shippingAddress as unknown as Record<string, string>,
          giftPackaging,
          giftNote: giftNote ?? null,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtPurchase:
                item.variant.priceOverride ?? item.variant.product.basePrice,
            })),
          },
        },
      });

      return { order: newOrder, totalAmount: amount };
    });

    order = result.order;
    totalAmount = result.totalAmount;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    // Parse stock insufficient error
    if (message.includes("|||")) {
      const [errorMsg, variantId, available] = message.split("|||");
      return NextResponse.json(
        { error: errorMsg, variantId, available: Number(available) },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 409 });
  }

  // Create Stripe PaymentIntent (outside transaction — order stays PENDING if Stripe call fails)
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: totalAmount,
      currency: "usd",
      metadata: {
        cartId: cart.id,
        orderId: order.id,
      },
    },
    { idempotencyKey }
  );

  // Persist PaymentIntent ID to the order
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentIntentId: paymentIntent.id },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
    totalAmount,
  });
}
