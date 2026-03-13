import { NextResponse } from "next/server";
import { getOrCreateSessionId, getCartDTO } from "@/lib/cart";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const cart = await getCartDTO(sessionId);

  if (!cart) {
    return NextResponse.json({ id: null, items: [], totalAmount: 0, totalItems: 0 });
  }

  return NextResponse.json(cart);
}
