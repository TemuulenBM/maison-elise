import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getOrCreateSessionId, getCartDTO, getCartDTOByUserId } from "@/lib/cart"

const EMPTY_CART = { id: null, items: [], totalAmount: 0, totalItems: 0 }

export async function GET() {
  // Authenticated user → look up cart by userId
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const cart = await getCartDTOByUserId(user.id)
      return NextResponse.json(cart ?? EMPTY_CART)
    }
  } catch {
    // Auth check failed → fall through to guest flow
  }

  // Guest → look up by sessionId
  const sessionId = await getOrCreateSessionId()
  const cart = await getCartDTO(sessionId)

  return NextResponse.json(cart ?? EMPTY_CART)
}
