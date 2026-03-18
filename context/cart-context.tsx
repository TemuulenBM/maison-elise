"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { SITE_IMAGES } from "@/lib/site-images"

export interface CartDisplayItem {
  cartItemId: string
  variantId: string
  productName: string
  productEdition: string
  productSlug: string
  colorName: string
  image: string
  price: number // доллар
  quantity: number
}

interface CartContextType {
  items: CartDisplayItem[]
  isOpen: boolean
  isLoading: boolean
  error: string | null
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  toggleCart: () => void
  closeCart: () => void
  clearError: () => void
  totalItems: number
  totalPrice: number
  cartId: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface ServerCartItem {
  id: string
  variantId: string
  quantity: number
  priceAtAdd: number
  variant: {
    id: string
    sku: string
    attributes: { color: string; colorHex: string }
    price: number
    available: number
    product: { id: string; slug: string; name: string; edition: string | null }
    images: Array<{ url: string; altText: string | null }>
  }
}

interface ServerCart {
  id: string | null
  items: ServerCartItem[]
  totalAmount: number
  totalItems: number
}

function serverCartToDisplay(serverCart: ServerCart) {
  return {
    cartId: serverCart.id,
    totalAmount: serverCart.totalAmount / 100,
    totalItems: serverCart.totalItems,
    items: serverCart.items.map((item): CartDisplayItem => ({
      cartItemId: item.id,
      variantId: item.variantId,
      productName: item.variant.product.name,
      productEdition: item.variant.product.edition ?? "",
      productSlug: item.variant.product.slug,
      colorName: item.variant.attributes.color,
      image: item.variant.images[0]?.url ?? SITE_IMAGES.productCyme,
      price: item.priceAtAdd / 100,
      quantity: item.quantity,
    })),
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartDisplayItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cartId, setCartId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Алдааг 5 секундын дараа автоматаар цэвэрлэх
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 5000)
    return () => clearTimeout(timer)
  }, [error])

  const fetchCart = useCallback(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data: ServerCart) => {
        const result = serverCartToDisplay(data)
        setItems(result.items)
        setCartId(result.cartId)
      })
      .catch(() => setError("Failed to load cart"))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Auth state change дээр cart дахин fetch (login/logout)
  useEffect(() => {
    const handleAuthChange = () => fetchCart()
    window.addEventListener("auth-state-changed", handleAuthChange)
    return () => window.removeEventListener("auth-state-changed", handleAuthChange)
  }, [fetchCart])

  const refreshCart = useCallback((data: ServerCart) => {
    const result = serverCartToDisplay(data)
    setItems(result.items)
    setCartId(result.cartId)
  }, [])

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      setError(null)
      try {
        const res = await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error ?? "Failed to add item to cart")
          setIsOpen(true)
          return
        }
        refreshCart(await res.json())
        setIsOpen(true)
      } catch {
        setError("Network error — please try again")
        setIsOpen(true)
      }
    },
    [refreshCart]
  )

  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      setError(null)
      try {
        const res = await fetch(`/api/cart/items/${cartItemId}`, { method: "DELETE" })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error ?? "Failed to remove item")
          return
        }
        refreshCart(await res.json())
      } catch {
        setError("Network error — please try again")
      }
    },
    [refreshCart]
  )

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(cartItemId)
        return
      }
      setError(null)
      try {
        const res = await fetch(`/api/cart/items/${cartItemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error ?? "Failed to update quantity")
          return
        }
        refreshCart(await res.json())
      } catch {
        setError("Network error — please try again")
      }
    },
    [refreshCart, removeFromCart]
  )

  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const clearError = useCallback(() => setError(null), [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        closeCart,
        clearError,
        totalItems,
        totalPrice,
        cartId,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
