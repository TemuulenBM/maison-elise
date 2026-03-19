import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId, getCartDTO } from "@/lib/cart";
import { updateCartItemSchema } from "@/lib/validators/cart";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateCartItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { quantity } = parsed.data;
  const sessionId = await getOrCreateSessionId();

  // Find cart item and verify ownership
  const item = await prisma.cartItem.findUnique({
    where: { id },
    include: {
      cart: { select: { sessionId: true } },
      variant: { select: { stockQuantity: true, reserved: true } },
    },
  });

  if (!item || item.cart.sessionId !== sessionId) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  const diff = quantity - item.quantity;
  const available = item.variant.stockQuantity - item.variant.reserved;

  if (diff > 0 && diff > available) {
    return NextResponse.json(
      { error: "Insufficient stock", available: available + item.quantity },
      { status: 409 }
    );
  }

  await prisma.$transaction([
    prisma.cartItem.update({
      where: { id },
      data: { quantity },
    }),
    prisma.productVariant.update({
      where: { id: item.variantId },
      data: { reserved: { increment: diff } },
    }),
  ]);

  const updatedCart = await getCartDTO(sessionId);
  return NextResponse.json(updatedCart);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = await getOrCreateSessionId();

  const item = await prisma.cartItem.findUnique({
    where: { id },
    include: { cart: { select: { sessionId: true } } },
  });

  if (!item || item.cart.sessionId !== sessionId) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.cartItem.delete({ where: { id } }),
    prisma.productVariant.update({
      where: { id: item.variantId },
      data: { reserved: { decrement: item.quantity } },
    }),
  ]);

  const updatedCart = await getCartDTO(sessionId);
  return NextResponse.json(updatedCart);
}
