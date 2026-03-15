"use client"

import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

export function CheckoutHeader() {
  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-6 lg:px-12 py-5">
        {/* Back */}
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-medium hidden sm:inline">
            Return to Shopping
          </span>
        </Link>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="font-serif text-lg tracking-[0.2em] text-foreground font-light">
            MAISON ÉLISE
          </h1>
        </Link>

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
