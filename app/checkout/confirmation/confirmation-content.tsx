"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface OrderItemData {
  name: string
  edition: string
  color: string
  image: string
  price: number
  quantity: number
}

interface LastOrder {
  orderId: string
  items: OrderItemData[]
  totalPrice: number
  shippingAddress: {
    fullName: string
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
}

/* Animated checkmark SVG */
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      className="w-20 h-20 border border-primary flex items-center justify-center mb-8"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <motion.path
          d="M8 16L14 22L24 10"
          stroke="#C9A96E"
          strokeWidth="2"
          strokeLinecap="square"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  )
}

export function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderData, setOrderData] = useState<LastOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Retrieve order data from sessionStorage
    try {
      const stored = sessionStorage.getItem("me_last_order")
      if (stored) {
        const data = JSON.parse(stored) as LastOrder
        setOrderData(data)
        // Clean up after retrieval
        sessionStorage.removeItem("me_last_order")
      }
    } catch {
      // sessionStorage not available
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="flex items-center justify-center px-6 py-5">
          <Link href="/">
            <h1 className="font-serif text-lg tracking-[0.2em] text-foreground font-light">
              MAISON ÉLISE
            </h1>
          </Link>
        </div>
      </header>

      {/* Confirmation content */}
      <div className="max-w-2xl mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <AnimatedCheckmark />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground font-light tracking-[0.04em] mb-3">
              Thank You for Your Order
            </h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-md mx-auto">
              Your order has been placed successfully. A confirmation email will be sent to you shortly.
            </p>
          </motion.div>

          {/* Order number */}
          {orderId && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 py-4 px-8 border border-border"
            >
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Order Number
              </p>
              <p className="text-[14px] text-foreground font-medium tracking-wide">
                {orderId}
              </p>
            </motion.div>
          )}
        </div>

        {/* Order details */}
        {orderData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12"
          >
            <Separator className="bg-border mb-8" />

            {/* Items */}
            <div className="space-y-5">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 h-16 bg-[var(--surface-2)] flex-shrink-0 overflow-hidden relative border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-foreground uppercase tracking-wide">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.edition} &middot; {item.color}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-[13px] text-foreground">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="bg-border my-6" />

            <div className="flex justify-between items-baseline">
              <span className="text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
                Total
              </span>
              <span className="font-serif text-xl text-foreground font-light">
                ${orderData.totalPrice.toLocaleString()}
              </span>
            </div>

            {/* Shipping address */}
            <Separator className="bg-border my-6" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
                Shipping To
              </p>
              <div className="text-[13px] text-foreground leading-relaxed space-y-0.5">
                <p>{orderData.shippingAddress.fullName}</p>
                <p>{orderData.shippingAddress.line1}</p>
                {orderData.shippingAddress.line2 && <p>{orderData.shippingAddress.line2}</p>}
                <p>
                  {orderData.shippingAddress.city}
                  {orderData.shippingAddress.state && `, ${orderData.shippingAddress.state}`}{" "}
                  {orderData.shippingAddress.postalCode}
                </p>
                <p>{orderData.shippingAddress.country}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Delivery note + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-12 flex flex-col items-center text-center"
        >
          <div className="py-6 px-8 border border-border mb-8 max-w-md">
            <p className="text-[12px] text-foreground leading-relaxed">
              Your order will be carefully packaged and shipped within
              <span className="text-primary"> 2&ndash;3 business days</span>.
              You will receive a tracking number via email once shipped.
            </p>
          </div>

          <Link
            href="/collection"
            className="px-10 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-colors duration-300"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="mt-4 text-[11px] text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            Return to Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
