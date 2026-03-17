import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  stockQuantity: z.number().int().min(0),
});

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
}

async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const adminEmails = getAdminEmails();
  if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? "")) return null;
  return user;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const variant = await prisma.productVariant.findUnique({ where: { id } });
  if (!variant) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });
  }

  const updated = await prisma.productVariant.update({
    where: { id },
    data: { stockQuantity: parsed.data.stockQuantity },
    select: { id: true, sku: true, stockQuantity: true, reserved: true },
  });

  return NextResponse.json(updated);
}
