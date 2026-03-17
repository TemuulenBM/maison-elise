import { NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@/lib/supabase/middleware"

const PROTECTED_ROUTES = ["/account"]
const AUTH_ROUTES = ["/auth/login", "/auth/signup"]
const ADMIN_ROUTES = ["/admin"]

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean)
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createMiddlewareClient(request, response)

  // Session refresh — expired token-ийг шинэчилнэ
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Admin route protection
  if (ADMIN_ROUTES.some((route) => path.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(loginUrl)
    }
    const adminEmails = getAdminEmails()
    if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? "")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Protected route-д нэвтрээгүй бол login руу redirect
  if (PROTECTED_ROUTES.some((route) => path.startsWith(route)) && !user) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(loginUrl)
  }

  // Нэвтэрсэн хэрэглэгч auth хуудсуудад очвол account руу redirect
  if (AUTH_ROUTES.some((route) => path.startsWith(route)) && user) {
    return NextResponse.redirect(new URL("/account", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
