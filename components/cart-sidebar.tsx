"use client"

import { ImageWithSkeleton } from "./image-with-skeleton"
import { Plus, Minus, ShoppingBag, X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="bg-card border-l border-border sm:max-w-md w-full p-0 gap-0"
      >
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            <SheetTitle className="font-serif text-xl text-foreground">
              Your Selection
            </SheetTitle>
            <span className="text-[12px] text-muted-foreground">({items.length})</span>
          </div>
          <SheetDescription className="sr-only">Your selection</SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <ShoppingBag className="w-12 h-12 text-border mb-4" />
              <p className="font-serif text-xl text-foreground mb-2">Your selection is empty</p>
              <p className="text-[12px] text-muted-foreground">
                Explore our collection and find your next piece
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="flex gap-4 pb-6 border-b border-border"
                >
                  <div className="w-24 h-24 bg-background flex-shrink-0 overflow-hidden relative">
                    <ImageWithSkeleton
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[12px] text-foreground uppercase tracking-wide">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.product.edition}
                        </p>
                        {item.selectedColor && (
                          <p className="text-[10px] text-muted-foreground">
                            Color: {item.selectedColor}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[12px] text-foreground w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="text-[13px] text-foreground">
                        ${item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                Subtotal
              </span>
              <span className="font-serif text-xl text-foreground">
                ${totalPrice}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Shipping and duties estimated at checkout
            </p>
            <button type="button" className="w-full py-4 bg-foreground text-background text-[11px] tracking-[0.15em] uppercase hover:bg-primary transition-colors">
              Continue to Checkout
            </button>
            <button
              type="button"
              onClick={closeCart}
              className="w-full py-3 border border-border text-foreground text-[11px] tracking-[0.15em] uppercase hover:border-primary hover:text-primary transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
