import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      const cartId = paymentIntent.metadata.cartId;

      if (!orderId) break;

      // Idempotency: зөвхөн PENDING order-ийг process хийх
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order || order.status !== "PENDING") {
        // Аль хэдийн process хийгдсэн эсвэл олдоогүй — алгасах
        break;
      }

      // Атомар: Order status + stock decrement нэг transaction-д
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: { status: "CONFIRMED" },
        }),
        ...order.items.map((item) =>
          prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: { decrement: item.quantity },
              reserved: { decrement: item.quantity },
            },
          })
        ),
      ]);

      // Cart устгах
      if (cartId) {
        await prisma.cart.delete({ where: { id: cartId } }).catch(() => {});
      }

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        // Order-ийн reserved буцаах
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (order && order.status === "PENDING") {
          for (const item of order.items) {
            await prisma.productVariant.update({
              where: { id: item.variantId },
              data: { reserved: { decrement: item.quantity } },
            });
          }
        }
      }

      break;
    }
  }

  return NextResponse.json({ received: true });
}
