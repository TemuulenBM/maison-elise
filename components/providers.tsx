"use client"

import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/context/cart-context"
import { CustomCursor } from "@/components/ui/custom-cursor"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomCursor />
        {children}
      </CartProvider>
    </AuthProvider>
  )
}
