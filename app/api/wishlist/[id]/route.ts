import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/cart";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionId = await getOrCreateSessionId();

  const entry = await prisma.wishlist.findUnique({
    where: { id },
    select: { id: true, sessionId: true },
  });

  if (!entry) {
    return NextResponse.json({ error: "Wishlist item not found" }, { status: 404 });
  }

  // Only allow deletion of items belonging to the current session
  if (entry.sessionId !== sessionId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.wishlist.delete({ where: { id } });

  return NextResponse.json({ message: "Removed from wishlist" });
}
