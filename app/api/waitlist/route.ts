import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { waitlistSchema } from "@/lib/validators/waitlist";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = waitlistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { productId, email, name } = parsed.data;

  // Product байгаа эсэхийг шалгах
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Давхардал шалгах (upsert)
  const entry = await prisma.waitlist.upsert({
    where: { productId_email: { productId, email } },
    update: { name },
    create: { productId, email, name },
  });

  return NextResponse.json(
    { id: entry.id, message: "Successfully joined waitlist" },
    { status: 201 }
  );
}
