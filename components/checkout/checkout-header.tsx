"use client"

import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

const STEPS = ["Bag", "Details", "Confirmation"]

interface CheckoutHeaderProps {
  activeStep?: number // 0 = Bag, 1 = Details, 2 = Confirmation
}

export function CheckoutHeader({ activeStep = 1 }: CheckoutHeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-6 lg:px-12 py-5 relative">
        {/* Back */}
        <Link
          href="/cart"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-medium hidden sm:inline">
            Return to Bag
          </span>
        </Link>

        {/* Logo + Steps */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <Link href="/">
            <h1 className="font-serif text-lg tracking-[0.2em] text-foreground font-light">
              MAISON ÉLISE
            </h1>
          </Link>
          {/* Progress steps */}
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i <= activeStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                  <span
                    className={`text-[9px] uppercase tracking-[0.15em] transition-colors ${
                      i === activeStep
                        ? "text-primary"
                        : i < activeStep
                          ? "text-muted-foreground"
                          : "text-border"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-10 h-px mb-3 transition-colors ${
                      i < activeStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Secure badge */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-[0.12em] font-medium hidden sm:inline">
            Secure Checkout
          </span>
        </div>
      </div>
    </header>
  )
}
