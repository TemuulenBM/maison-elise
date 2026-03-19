import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { waitlistSchema } from "@/lib/validators/waitlist";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { waitlistNotificationHtml, waitlistNotificationText } from "@/emails/waitlist-notification";
import { waitlistRateLimit } from "@/lib/redis";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";
  const { success } = await waitlistRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = waitlistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { productId, email, name } = parsed.data;

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, slug: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Check for duplicate entry (upsert)
  const entry = await prisma.waitlist.upsert({
    where: { productId_email: { productId, email } },
    update: { name },
    create: { productId, email, name },
  });

  // Send confirmation email for new registrations
  const isNew = entry.createdAt.getTime() === entry.createdAt.getTime();
  if (isNew) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You're on the list — ${product.name} | Maison Élise`,
      html: waitlistNotificationHtml({ name, email, productName: product.name, productSlug: product.slug }),
      text: waitlistNotificationText({ name, email, productName: product.name, productSlug: product.slug }),
    }).catch(() => {
      // Email errors should not fail the API response
    });
  }

  return NextResponse.json(
    { id: entry.id, message: "Successfully joined waitlist" },
    { status: 201 }
  );
}
