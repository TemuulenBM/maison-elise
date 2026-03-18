import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "email query parameter required" }, { status: 400 });
  }

  const entry = await prisma.waitlist.findUnique({
    where: { productId_email: { productId, email } },
    select: { id: true, createdAt: true, notifiedAt: true },
  });

  return NextResponse.json({ registered: !!entry, entry: entry ?? null });
}
