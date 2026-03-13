import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId, getOrCreateCart, getCartDTO } from "@/lib/cart";
import { addToCartSchema } from "@/lib/validators/cart";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = addToCartSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { variantId, quantity } = parsed.data;

  // Variant + stock шалгах
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: { select: { basePrice: true, status: true } } },
  });

  if (!variant || variant.product.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Product not found or unavailable" },
      { status: 404 }
    );
  }

  const available = variant.stockQuantity - variant.reserved;
  if (quantity > available) {
    return NextResponse.json(
      { error: "Insufficient stock", available },
      { status: 409 }
    );
  }

  const sessionId = await getOrCreateSessionId();
  const cart = await getOrCreateCart(sessionId);
  const price = variant.priceOverride ?? variant.product.basePrice;

  // Upsert: байгаа бол quantity нэмэх, байхгүй бол шинээр үүсгэх
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > available) {
      return NextResponse.json(
        { error: "Insufficient stock for requested quantity", available },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      }),
      prisma.productVariant.update({
        where: { id: variantId },
        data: { reserved: { increment: quantity } },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
          priceAtAdd: price,
        },
      }),
      prisma.productVariant.update({
        where: { id: variantId },
        data: { reserved: { increment: quantity } },
      }),
    ]);
  }

  const updatedCart = await getCartDTO(sessionId);
  return NextResponse.json(updatedCart, { status: 201 });
}
