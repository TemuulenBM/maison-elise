import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadProductImage } from "@/lib/supabase-storage"
import { requireAdmin } from "@/lib/admin"

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
  // FormData.get() returns FormDataEntryValue | null; narrow to File/string since we control the upload form
  const file = formData.get("file") as File | null
  const variantId = formData.get("variantId") as string | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File size must not exceed 10MB" }, { status: 400 })
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WEBP, and AVIF image formats are supported" },
      { status: 400 }
    )
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
        isPrimary: variantId === null,
        sortOrder: variantId === null ? 0 : 1,
      },
    })
  }

  return NextResponse.json({ url })
}
