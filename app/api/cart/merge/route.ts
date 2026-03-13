import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/cart";

// Guest cart → authenticated user cart нэгтгэх
export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const sessionId = await getOrCreateSessionId();

  const guestCart = await prisma.cart.findFirst({
    where: { sessionId, expiresAt: { gt: new Date() } },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) {
    return NextResponse.json({ merged: 0 });
  }

  // User-ийн cart олох эсвэл үүсгэх
  let userCart = await prisma.cart.findFirst({
    where: { userId, expiresAt: { gt: new Date() } },
    include: { items: true },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      include: { items: true },
    });
  }

  // Guest item бүрийг user cart-руу шилжүүлэх
  let merged = 0;
  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (i) => i.variantId === guestItem.variantId
    );

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + guestItem.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          variantId: guestItem.variantId,
          quantity: guestItem.quantity,
          priceAtAdd: guestItem.priceAtAdd,
        },
      });
    }
    merged++;
  }

  // Guest cart устгах
  await prisma.cart.delete({ where: { id: guestCart.id } });

  return NextResponse.json({ merged });
}
