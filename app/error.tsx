"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="relative flex flex-col items-center justify-center min-h-[65vh] px-6 text-center overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.3em] text-primary uppercase mb-6">Error</p>
          <h1 className="font-serif text-3xl lg:text-4xl text-foreground font-light mb-4">
            Something Went Wrong
          </h1>
          <p className="text-[13px] text-muted-foreground max-w-md mb-12 leading-relaxed mx-auto">
            We apologize for the inconvenience. Our team has been notified and is working to resolve
            this issue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={reset}
              className="text-[11px] tracking-[0.15em] text-primary border border-primary px-8 py-3 hover:bg-primary hover:text-background transition-colors uppercase"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="text-[11px] tracking-[0.15em] text-foreground border border-border px-8 py-3 hover:border-primary hover:text-primary transition-colors uppercase"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
