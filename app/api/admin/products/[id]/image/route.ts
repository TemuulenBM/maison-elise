import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"
import { uploadProductImage } from "@/lib/supabase-storage"

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean)
}

async function requireAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminEmails = getAdminEmails()
  if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? "")) return null
  return user
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id: productId } = await params

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const variantId = formData.get("variantId") as string | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const suffix = variantId ? `-${variantId}` : ""
  const fileName = `${product.slug}${suffix}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const url = await uploadProductImage(fileName, buffer, file.type || "image/jpeg")

  // Upsert ProductImage record
  const existing = await prisma.productImage.findFirst({
    where: {
      productId,
      variantId: variantId ?? null,
    },
  })

  if (existing) {
    await prisma.productImage.update({
      where: { id: existing.id },
      data: { url, altText: `${product.name}` },
    })
  } else {
    await prisma.productImage.create({
      data: {
        productId,
        variantId: variantId ?? null,
        url,
        altText: product.name,
        isPrimary: variantId == null,
        sortOrder: variantId == null ? 0 : 1,
      },
    })
  }

  return NextResponse.json({ url })
}
