import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanityClient } from "@/lib/sanity";
import { LOOKBOOK_BY_SLUG_QUERY } from "@/lib/sanity-queries";
import type { LookbookDoc, EditorialPageData } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Sanity болон DB-г паралель хүсэлт хийнэ
  const [editorial, hotspots] = await Promise.all([
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      ? sanityClient
          .fetch<LookbookDoc | null>(LOOKBOOK_BY_SLUG_QUERY, { slug })
          .catch(() => null as LookbookDoc | null)
      : Promise.resolve(null as LookbookDoc | null),
    prisma.editorialHotspot.findMany({
      where: { editorialSlug: slug },
    }),
  ]);

  if (!editorial) {
    return NextResponse.json({ error: "Editorial not found" }, { status: 404 });
  }

  // Hotspot бүхэн дэх бүтээгдэхүүний мэдээллийг нэг хүсэлтээр авна
  const productIds = [...new Set(hotspots.map((h) => h.productId))];
  const products =
    productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            slug: true,
            name: true,
            basePrice: true,
            variants: {
              take: 1,
              select: {
                images: {
                  orderBy: { sortOrder: "asc" },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        })
      : [];

  const productMap = new Map(products.map((p) => [p.id, p]));

  const data: EditorialPageData = {
    ...editorial,
    hotspots: hotspots
      .map((h) => {
        const product = productMap.get(h.productId);
        if (!product) return null;
        return {
          id: h.id,
          positionX: Number(h.positionX),
          positionY: Number(h.positionY),
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.basePrice / 100,
            imageUrl: product.variants[0]?.images[0]?.url ?? "",
          },
        };
      })
      .filter((h): h is NonNullable<typeof h> => h !== null),
  };

  return NextResponse.json(data);
}
