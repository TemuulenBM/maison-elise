import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { VariantAttributes } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      basePrice: true,
      variants: {
        select: {
          id: true,
          sku: true,
          attributes: true,
          priceOverride: true,
          stockQuantity: true,
          reserved: true,
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const variants = product.variants.map((v) => {
    const attrs = v.attributes as unknown as VariantAttributes;
    return {
      id: v.id,
      sku: v.sku,
      attributes: attrs,
      price: v.priceOverride ?? product.basePrice,
      stockQuantity: v.stockQuantity,
      reserved: v.reserved,
      available: v.stockQuantity - v.reserved,
    };
  });

  return NextResponse.json({ productId: product.id, variants });
}
