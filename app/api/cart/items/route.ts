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

  // Атомар upsert: interactive transaction ашиглан race condition-ээс сэргийлнэ
  try {
    await prisma.$transaction(async (tx) => {
      // Lock variant row to prevent concurrent stock modifications
      const [lockedVariant] = await tx.$queryRawUnsafe<
        Array<{ stock_quantity: number; reserved: number }>
      >(
        `SELECT stock_quantity, reserved FROM product_variants WHERE id = $1::uuid FOR UPDATE`,
        variantId
      );

      if (!lockedVariant) {
        throw new Error("Variant not found");
      }

      const currentAvailable =
        lockedVariant.stock_quantity - lockedVariant.reserved;

      const existing = await tx.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
      });

      const newQty = (existing?.quantity ?? 0) + quantity;
      if (newQty > currentAvailable) {
        throw new Error(`STOCK_INSUFFICIENT|||${currentAvailable}`);
      }

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: newQty },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            variantId,
            quantity,
            priceAtAdd: price,
          },
        });
      }

      await tx.productVariant.update({
        where: { id: variantId },
        data: { reserved: { increment: quantity } },
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add to cart";
    if (message.startsWith("STOCK_INSUFFICIENT")) {
      const available = Number(message.split("|||")[1]);
      return NextResponse.json(
        { error: "Insufficient stock for requested quantity", available },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const updatedCart = await getCartDTO(sessionId);
  return NextResponse.json(updatedCart, { status: 201 });
}
