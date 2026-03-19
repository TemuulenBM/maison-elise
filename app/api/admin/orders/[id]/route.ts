import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { shippingNotificationHtml, shippingNotificationText } from "@/emails/shipping-notification";
import type { VariantAttributes } from "@/types";

const patchSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "REFUNDED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { select: { name: true, edition: true } },
            },
          },
        },
      },
      user: { select: { fullName: true } },
    },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  // Send shipping notification when transitioning to SHIPPED (idempotency guard)
  if (parsed.data.status === "SHIPPED" && order.status !== "SHIPPED") {
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
      }));

      await resend.emails.send({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: `Your Order Has Shipped — Maison Élise`,
        html: shippingNotificationHtml({
          orderId: order.id,
          customerName: order.user.fullName ?? undefined,
          customerEmail,
          items: emailItems,
          shippingAddress,
        }),
        text: shippingNotificationText({
          orderId: order.id,
          customerName: order.user.fullName ?? undefined,
          customerEmail,
          items: emailItems,
          shippingAddress,
        }),
      }).catch(() => {
        // Email errors must not fail the status update
      });
    }
  }

  return NextResponse.json(updated);
}
