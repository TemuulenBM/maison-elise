"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js"
import type { StripeElementsOptions, Appearance } from "@stripe/stripe-js"
import { motion } from "framer-motion"
import { Loader2, ShoppingBag, AlertCircle } from "lucide-react"
import Link from "next/link"

import { stripePromise } from "@/lib/stripe-client"
import { shippingAddressSchema } from "@/lib/validators/order"
import { useCart } from "@/context/cart-context"
import { CheckoutHeader } from "@/components/checkout/checkout-header"
import { OrderSummary } from "@/components/checkout/order-summary"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { GiftOptions } from "@/components/checkout/gift-options"
import { PaymentSection } from "@/components/checkout/payment-section"

/* ──────────────────────────────────────────────
   Form schema (extends existing shippingAddressSchema)
   ────────────────────────────────────────────── */

const checkoutFormSchema = shippingAddressSchema.extend({
  giftPackaging: z.boolean().default(false),
  giftNote: z.string().max(500).optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>

/* ──────────────────────────────────────────────
   Stripe appearance — matches Maison Élise design
   ────────────────────────────────────────────── */

const stripeAppearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#C9A96E",
    colorBackground: "#151513",
    colorText: "#F5F0EB",
    colorTextSecondary: "#8A8A85",
    colorDanger: "#8B4444",
    fontFamily: "Montserrat, sans-serif",
    fontSizeBase: "13px",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid #2A2A28",
      backgroundColor: "#151513",
      padding: "12px 16px",
      transition: "border-color 0.3s ease",
    },
    ".Input:focus": {
      border: "1px solid #C9A96E",
      boxShadow: "none",
    },
    ".Label": {
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      color: "#8A8A85",
      fontWeight: "500",
      marginBottom: "8px",
    },
    ".Tab": {
      border: "1px solid #2A2A28",
      backgroundColor: "transparent",
    },
    ".Tab--selected": {
      border: "1px solid #C9A96E",
      backgroundColor: "#1A1A18",
    },
    ".Tab:hover": {
      border: "1px solid #C9A96E",
    },
  },
}

/* ──────────────────────────────────────────────
   Checkout state
   ────────────────────────────────────────────── */

type CheckoutState = "idle" | "creating" | "confirming" | "succeeded" | "error"

/* ──────────────────────────────────────────────
   Inner form (needs Stripe hooks inside Elements)
   ────────────────────────────────────────────── */

function CheckoutFormInner() {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const { items, totalPrice, cartId, isLoading: cartLoading } = useCart()

  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      giftPackaging: false,
      giftNote: "",
    },
  })

  const isSubmitting = checkoutState === "creating" || checkoutState === "confirming"

  async function onSubmit(data: CheckoutFormData) {
    if (!stripe || !elements || !cartId) return

    setErrorMessage(null)
    setCheckoutState("creating")

    try {
      // 1. Validate Stripe Elements
      const { error: elementsError } = await elements.submit()
      if (elementsError) {
        setErrorMessage(elementsError.message || "Please check your payment details.")
        setCheckoutState("error")
        return
      }

      // 2. Create order + PaymentIntent on server
      const idempotencyKey = crypto.randomUUID()
      const response = await fetch("/api/checkout/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          shippingAddress: {
            fullName: data.fullName,
            line1: data.line1,
            line2: data.line2 || undefined,
            city: data.city,
            state: data.state || undefined,
            postalCode: data.postalCode,
            country: data.country,
            phone: data.phone || undefined,
          },
          giftPackaging: data.giftPackaging,
          giftNote: data.giftNote || undefined,
          idempotencyKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 409 && errorData.variantId) {
          setErrorMessage(
            `${errorData.error}. Only ${errorData.available} available. Please return to your cart to adjust.`
          )
        } else {
          setErrorMessage(errorData.error || "Unable to process your order. Please try again.")
        }
        setCheckoutState("error")
        return
      }

      const { clientSecret, orderId } = await response.json()

      // 3. Confirm payment with Stripe
      setCheckoutState("confirming")

      // Store order info for confirmation page
      try {
        sessionStorage.setItem(
          "me_last_order",
          JSON.stringify({
            orderId,
            items: items.map((i) => ({
              name: i.productName,
              edition: i.productEdition,
              color: i.colorName,
              image: i.image,
              price: i.price,
              quantity: i.quantity,
            })),
            totalPrice,
            shippingAddress: data,
          })
        )
      } catch {
        // sessionStorage not available — confirmation page will work without it
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation?orderId=${orderId}`,
        },
      })

      // confirmPayment only returns if there's an error (otherwise redirects)
      if (confirmError) {
        setErrorMessage(confirmError.message || "Payment failed. Please try again.")
        setCheckoutState("error")
      }
    } catch {
      setErrorMessage("Unable to process your order. Please check your connection and try again.")
      setCheckoutState("error")
    }
  }

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
      </div>
    )
  }

  // Empty cart
  if (!cartLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <CheckoutHeader />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <ShoppingBag className="w-16 h-16 text-border mb-6" />
          <h2 className="font-serif text-2xl text-foreground font-light mb-3">
            Your Selection is Empty
          </h2>
          <p className="text-[13px] text-muted-foreground mb-8 text-center max-w-sm">
            Explore our collection and discover your next statement piece
          </p>
          <Link
            href="/collection"
            className="px-10 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] hover:bg-primary transition-colors duration-300"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px]">
        {/* Mobile order summary */}
        <div className="lg:hidden order-1">
          <OrderSummary items={items} totalPrice={totalPrice} />
        </div>

        {/* Form column */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="order-2 lg:order-1"
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 lg:px-12 xl:px-20 py-10 max-w-2xl mx-auto lg:mx-0 lg:max-w-none space-y-10">
            {/* Error banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-900/40"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] text-red-200 leading-relaxed">{errorMessage}</p>
                  {errorMessage.includes("return to your cart") && (
                    <Link
                      href="/"
                      className="text-[11px] text-primary underline underline-offset-2 mt-1 inline-block"
                    >
                      Return to Cart
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ShippingForm form={form} />
            </motion.div>

            {/* Gift options */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="border-t border-border pt-10">
                <GiftOptions form={form} />
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="border-t border-border pt-10">
                <PaymentSection />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="border-t border-border pt-10">
                {/* Desktop submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !stripe || !elements}
                  className="hidden lg:flex w-full items-center justify-center gap-3 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutState === "creating" && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Preparing Your Order...
                    </>
                  )}
                  {checkoutState === "confirming" && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Payment...
                    </>
                  )}
                  {(checkoutState === "idle" || checkoutState === "error") && (
                    <>Place Order &mdash; ${totalPrice.toLocaleString()}</>
                  )}
                </button>

                <p className="text-[10px] text-muted-foreground text-center mt-3 hidden lg:block">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </motion.div>
          </form>
        </motion.div>

        {/* Desktop order summary sidebar */}
        <div className="hidden lg:block order-2">
          <OrderSummary items={items} totalPrice={totalPrice} />
        </div>
      </div>

      {/* Mobile sticky submit */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface-2)] border-t border-border p-4 z-50">
        <button
          type="submit"
          form="checkout-form"
          disabled={isSubmitting || !stripe || !elements}
          onClick={form.handleSubmit(onSubmit)}
          className="w-full flex items-center justify-center gap-3 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkoutState === "creating" && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Preparing Your Order...
            </>
          )}
          {checkoutState === "confirming" && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Payment...
            </>
          )}
          {(checkoutState === "idle" || checkoutState === "error") && (
            <>Place Order &mdash; ${totalPrice.toLocaleString()}</>
          )}
        </button>
      </div>

      {/* Mobile bottom padding to account for sticky button */}
      <div className="lg:hidden h-24" />
    </div>
  )
}

/* ──────────────────────────────────────────────
   Wrapper with Stripe Elements provider
   ────────────────────────────────────────────── */

export function CheckoutForm() {
  const { totalPrice } = useCart()

  const elementsOptions: StripeElementsOptions = useMemo(
    () => ({
      mode: "payment" as const,
      amount: Math.round(totalPrice * 100) || 100, // cents, minimum 100
      currency: "usd",
      appearance: stripeAppearance,
    }),
    [totalPrice]
  )

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <CheckoutFormInner />
    </Elements>
  )
}
