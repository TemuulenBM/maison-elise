import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutIntentSchema } from "@/lib/validators/order";

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

  // Cart + items авах
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

  // Stock availability дахин шалгах (server-side validation)
  for (const item of cart.items) {
    const available =
      item.variant.stockQuantity - item.variant.reserved;
    if (item.quantity > available) {
      return NextResponse.json(
        {
          error: `Insufficient stock for ${item.variant.product.name}`,
          variantId: item.variantId,
          available,
        },
        { status: 409 }
      );
    }

    if (item.variant.product.status !== "ACTIVE") {
      return NextResponse.json(
        { error: `Product ${item.variant.product.name} is no longer available` },
        { status: 409 }
      );
    }
  }

  // Server-side amount тооцоолох (client-д бүү итгэ)
  const totalAmount = cart.items.reduce((sum, item) => {
    const price =
      item.variant.priceOverride ?? item.variant.product.basePrice;
    return sum + price * item.quantity;
  }, 0);

  // Stripe PaymentIntent үүсгэх
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: totalAmount,
      currency: "usd",
      metadata: {
        cartId: cart.id,
        orderId: "", // Order үүссний дараа update хийнэ
      },
    },
    { idempotencyKey }
  );

  // Order (PENDING) үүсгэх
  const order = await prisma.order.create({
    data: {
      userId: cart.userId ?? "00000000-0000-0000-0000-000000000000", // Guest fallback
      status: "PENDING",
      totalAmount,
      paymentIntentId: paymentIntent.id,
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

  // PaymentIntent metadata-д orderId нэмэх
  await stripe.paymentIntents.update(paymentIntent.id, {
    metadata: { cartId: cart.id, orderId: order.id },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order.id,
    totalAmount,
  });
}
