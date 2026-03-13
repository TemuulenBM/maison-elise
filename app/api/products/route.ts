import { NextRequest, NextResponse } from "next/server";
import { productQuerySchema } from "@/lib/validators/product";
import { getProducts } from "@/lib/products";

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = productQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await getProducts(parsed.data);
  return NextResponse.json(result);
}
