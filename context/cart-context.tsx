"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

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
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  toggleCart: () => void
  closeCart: () => void
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
      image: item.variant.images[0]?.url ?? "/images/placeholder.jpg",
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

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data: ServerCart) => {
        const result = serverCartToDisplay(data)
        setItems(result.items)
        setCartId(result.cartId)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const refreshCart = useCallback((data: ServerCart) => {
    const result = serverCartToDisplay(data)
    setItems(result.items)
    setCartId(result.cartId)
  }, [])

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity }),
      })
      if (!res.ok) return
      refreshCart(await res.json())
      setIsOpen(true)
    },
    [refreshCart]
  )

  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      const res = await fetch(`/api/cart/items/${cartItemId}`, { method: "DELETE" })
      if (!res.ok) return
      refreshCart(await res.json())
    },
    [refreshCart]
  )

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeFromCart(cartItemId)
        return
      }
      const res = await fetch(`/api/cart/items/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })
      if (!res.ok) return
      refreshCart(await res.json())
    },
    [refreshCart, removeFromCart]
  )

  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        closeCart,
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
