import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getOrCreateSessionId, getCartDTO, getCartDTOByUserId } from "@/lib/cart"

const EMPTY_CART = { id: null, items: [], totalAmount: 0, totalItems: 0 }

export async function GET() {
  // Run auth check and session ID retrieval in parallel
  // getSession() reads JWT from cookies locally (no network call) — sufficient for cart reads
  const [user, sessionId] = await Promise.all([
    createServerClient()
      .then((s) => s.auth.getSession())
      .then(({ data }) => data.session?.user ?? null)
      .catch(() => null),
    getOrCreateSessionId(),
  ])

  // Authenticated user → look up cart by userId
  if (user) {
    const cart = await getCartDTOByUserId(user.id)
    return NextResponse.json(cart ?? EMPTY_CART)
  }

  // Guest → look up by sessionId
  const cart = await getCartDTO(sessionId)
  return NextResponse.json(cart ?? EMPTY_CART)
}
