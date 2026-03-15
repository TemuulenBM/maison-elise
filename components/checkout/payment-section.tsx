"use client"

import { PaymentElement } from "@stripe/react-stripe-js"
import { Shield } from "lucide-react"

export function PaymentSection() {
  return (
    <section>
      <h2 className="font-serif text-xl text-foreground font-light tracking-[0.04em] mb-6">
        Payment
      </h2>

      <div className="border border-border p-5">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Shield className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground tracking-[0.05em]">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>
    </section>
  )
}
