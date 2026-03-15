import { cookies } from "next/headers"
import { prisma } from "./prisma"
import type { Prisma } from "@/lib/generated/prisma"
import type { CartDTO, ServerCartItemDTO, VariantAttributes } from "@/types"

const SESSION_COOKIE = "me_session_id"
const CART_EXPIRY_DAYS = 30

export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    cookieStore.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: CART_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    })
  }

  return sessionId
}

export async function getOrCreateCart(sessionId: string) {
  const expiresAt = new Date(
    Date.now() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  )

  let cart = await prisma.cart.findFirst({
    where: { sessionId, expiresAt: { gt: new Date() } },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId, expiresAt },
    })
  }

  return cart
}

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: { id: true, slug: true, name: true, edition: true },
          },
          images: { orderBy: { sortOrder: "asc" as const } },
        },
      },
    },
  },
} as const

type CartWithItems = Prisma.CartGetPayload<typeof cartInclude extends Prisma.CartInclude ? { include: typeof cartInclude } : never>

function toCartDTO(cart: CartWithItems): CartDTO {
  const items: ServerCartItemDTO[] = cart.items.map((item) => ({
    id: item.id,
    variantId: item.variantId,
    quantity: item.quantity,
    priceAtAdd: item.priceAtAdd,
    variant: {
      id: item.variant.id,
      sku: item.variant.sku,
      attributes: item.variant.attributes as unknown as VariantAttributes,
      price: item.variant.priceOverride ?? item.priceAtAdd,
      available: item.variant.stockQuantity - item.variant.reserved,
      product: item.variant.product,
      images: item.variant.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
      })),
    },
  }))

  const totalAmount = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return { id: cart.id, items, totalAmount, totalItems }
}

export async function getCartDTOByUserId(userId: string): Promise<CartDTO | null> {
  const cart = await prisma.cart.findFirst({
    where: { userId, expiresAt: { gt: new Date() } },
    include: cartInclude,
  })

  if (!cart) return null
  return toCartDTO(cart)
}

export async function getCartDTO(sessionId: string): Promise<CartDTO | null> {
  const cart = await prisma.cart.findFirst({
    where: { sessionId, expiresAt: { gt: new Date() } },
    include: cartInclude,
  })

  if (!cart) return null
  return toCartDTO(cart)
}
