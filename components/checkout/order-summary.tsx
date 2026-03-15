"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { ImageWithSkeleton } from "@/components/image-with-skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { CartDisplayItem } from "@/context/cart-context"

interface OrderSummaryProps {
  items: CartDisplayItem[]
  totalPrice: number
}

function OrderItems({ items, totalPrice }: OrderSummaryProps) {
  return (
    <>
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex gap-4">
            <div className="w-20 h-20 bg-background flex-shrink-0 overflow-hidden relative border border-border">
              <ImageWithSkeleton
                src={item.image}
                alt={item.productName}
                fill
                className="object-cover"
              />
              {/* Quantity badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-foreground uppercase tracking-wide leading-tight">
                {item.productName}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {item.productEdition}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {item.colorName}
              </p>
            </div>
            <p className="text-[13px] text-foreground whitespace-nowrap">
              ${(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-5 bg-border" />

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
            Subtotal
          </span>
          <span className="text-[13px] text-foreground">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
            Shipping
          </span>
          <span className="text-[12px] text-primary italic">
            Complimentary
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
            Estimated Tax
          </span>
          <span className="text-[12px] text-muted-foreground">
            Calculated at payment
          </span>
        </div>
      </div>

      <Separator className="my-5 bg-border" />

      <div className="flex justify-between items-baseline">
        <span className="text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
          Total
        </span>
        <span className="font-serif text-2xl text-foreground font-light">
          ${totalPrice.toLocaleString()}
        </span>
      </div>
    </>
  )
}

/* Desktop sidebar */
function DesktopSummary(props: OrderSummaryProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-8 bg-[var(--surface-2)] border-l border-border p-8 min-h-screen">
        <h2 className="font-serif text-xl text-foreground font-light tracking-[0.04em] mb-6">
          Order Summary
        </h2>
        <OrderItems {...props} />
      </div>
    </aside>
  )
}

/* Mobile collapsible */
function MobileSummary({ items, totalPrice }: OrderSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden border-b border-border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
            Order Summary
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </div>
        <span className="font-serif text-lg text-foreground font-light">
          ${totalPrice.toLocaleString()}
        </span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-400 ease-out",
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 pb-6">
          <OrderItems items={items} totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  )
}

export function OrderSummary(props: OrderSummaryProps) {
  return (
    <>
      <MobileSummary {...props} />
      <DesktopSummary {...props} />
    </>
  )
}
