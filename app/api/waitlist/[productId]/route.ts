import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const emailSchema = z.string().email();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "email query parameter required" }, { status: 400 });
  }

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const entry = await prisma.waitlist.findUnique({
    where: { productId_email: { productId, email } },
    select: { id: true, createdAt: true, notifiedAt: true },
  });

  return NextResponse.json({ registered: !!entry, entry: entry ?? null });
}
