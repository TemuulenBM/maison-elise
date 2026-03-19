import { NextRequest, NextResponse } from "next/server";
import { loginRateLimit } from "@/lib/redis";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anonymous";

  const { success } = await loginRateLimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  return NextResponse.json({ ok: true });
}
