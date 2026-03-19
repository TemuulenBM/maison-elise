import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@/lib/supabase/server";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const { page, limit } = querySchema.parse({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        items: {
          include: {
            variant: {
              select: {
                id: true,
                sku: true,
                attributes: true,
                images: {
                  orderBy: { sortOrder: "asc" },
                  take: 1,
                  select: { url: true, altText: true },
                },
                product: {
                  select: { id: true, name: true, slug: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.order.count({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({ orders, total, page, limit });
}
