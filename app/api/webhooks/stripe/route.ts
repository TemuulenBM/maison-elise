import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { orderConfirmationHtml, orderConfirmationText } from "@/emails/order-confirmation";
import type { VariantAttributes } from "@/types";
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
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: { select: { name: true, slug: true, edition: true } },
                  images: { orderBy: { sortOrder: "asc" }, take: 1 },
                },
              },
            },
          },
          user: { select: { fullName: true, id: true } },
        },
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

      // Хэрэглэгчийн email авах
      const { createServiceClient } = await import("@/lib/supabase");
      const supabaseAdmin = createServiceClient();
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(order.userId);
      const customerEmail = authUser?.user?.email;

      if (customerEmail) {
        const shippingAddress = order.shippingAddress as Record<string, string>;
        const emailItems = order.items.map((item) => ({
          name: item.variant.product.name,
          edition: item.variant.product.edition,
          color: (item.variant.attributes as unknown as VariantAttributes)?.color,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        }));

        await resend.emails.send({
          from: FROM_EMAIL,
          to: customerEmail,
          subject: `Order Confirmed — Maison Élise`,
          html: orderConfirmationHtml({
            orderId: order.id,
            customerName: order.user.fullName ?? undefined,
            customerEmail,
            items: emailItems,
            totalAmount: order.totalAmount,
            shippingAddress,
            giftPackaging: order.giftPackaging,
            giftNote: order.giftNote,
          }),
          text: orderConfirmationText({
            orderId: order.id,
            customerName: order.user.fullName ?? undefined,
            customerEmail,
            items: emailItems,
            totalAmount: order.totalAmount,
            shippingAddress,
            giftPackaging: order.giftPackaging,
            giftNote: order.giftNote,
          }),
        }).catch(() => {
          // Email алдаа нь webhook-ийг амжилтгүй болгохгүй
        });
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
