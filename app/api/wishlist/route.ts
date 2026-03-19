import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/cart";
import { wishlistSchema } from "@/lib/validators/wishlist";
import type { VariantAttributes } from "@/types";

export async function GET() {
  const sessionId = await getOrCreateSessionId();

  const items = await prisma.wishlist.findMany({
    where: { sessionId },
    include: {
      variant: {
        include: {
          product: {
            select: { id: true, slug: true, name: true, edition: true, basePrice: true },
          },
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const wishlist = items.map((item) => ({
    id: item.id,
    variantId: item.variantId,
    attributes: item.variant.attributes as unknown as VariantAttributes,
    product: item.variant.product,
    image: item.variant.images[0] ?? null,
    createdAt: item.createdAt.toISOString(),
  }));

  return NextResponse.json(wishlist);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = wishlistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { variantId } = parsed.data;
  const sessionId = await getOrCreateSessionId();

  // Verify variant exists
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { id: true },
  });

  if (!variant) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });
  }

  // Check for duplicate and toggle
  const existing = await prisma.wishlist.findFirst({
    where: { sessionId, variantId },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "removed" });
  }

  const entry = await prisma.wishlist.create({
    data: { sessionId, variantId },
  });

  return NextResponse.json({ id: entry.id, action: "added" }, { status: 201 });
}
