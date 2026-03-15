import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

const SESSION_COOKIE = "me_session_id"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") ?? "/account"

  if (code) {
    const supabase = await createServerClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Profile upsert — байхгүй бол үүсгэнэ
      await prisma.profile.upsert({
        where: { id: data.user.id },
        create: {
          id: data.user.id,
          fullName: data.user.user_metadata?.full_name ?? null,
          phone: data.user.user_metadata?.phone ?? null,
        },
        update: {},
      })

      // Guest cart → user cart merge
      const cookieStore = await cookies()
      const sessionId = cookieStore.get(SESSION_COOKIE)?.value

      if (sessionId) {
        await mergeGuestCart(sessionId, data.user.id)
      }
    }
  }

  return NextResponse.redirect(new URL(redirect, request.url))
}

async function mergeGuestCart(sessionId: string, userId: string) {
  const guestCart = await prisma.cart.findFirst({
    where: { sessionId, expiresAt: { gt: new Date() } },
    include: { items: true },
  })

  if (!guestCart || guestCart.items.length === 0) return

  let userCart = await prisma.cart.findFirst({
    where: { userId, expiresAt: { gt: new Date() } },
    include: { items: true },
  })

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      include: { items: true },
    })
  }

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
  }

  await prisma.cart.delete({ where: { id: guestCart.id } })
}
