import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase/server"
import { getOrCreateSessionId } from "@/lib/cart"

// Guest cart → authenticated user cart нэгтгэх
// Auth-secured: userId-г server-side auth-аас авна
export async function POST() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionId = await getOrCreateSessionId()

  const guestCart = await prisma.cart.findFirst({
    where: { sessionId, expiresAt: { gt: new Date() } },
    include: { items: true },
  })

  if (!guestCart || guestCart.items.length === 0) {
    return NextResponse.json({ merged: 0 })
  }

  // User-ийн cart олох эсвэл үүсгэх
  let userCart = await prisma.cart.findFirst({
    where: { userId: user.id, expiresAt: { gt: new Date() } },
    include: { items: true },
  })

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      include: { items: true },
    })
  }

  // Guest item бүрийг user cart-руу шилжүүлэх
  let merged = 0
  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (i) => i.variantId === guestItem.variantId
    )

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + guestItem.quantity },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          variantId: guestItem.variantId,
          quantity: guestItem.quantity,
          priceAtAdd: guestItem.priceAtAdd,
        },
      })
    }
    merged++
  }

  // Guest cart устгах
  await prisma.cart.delete({ where: { id: guestCart.id } })

  return NextResponse.json({ merged })
}
