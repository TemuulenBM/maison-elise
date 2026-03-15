"use client"

import { useState } from "react"
import { ImageWithSkeleton } from "./image-with-skeleton"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [isLoaded] = useState(true)

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithSkeleton
            src="/images/hero-model.jpg"
            alt="Luxury bag campaign"
            fill
            className={`object-cover transition-transform duration-[2s] ${
              isLoaded ? "scale-100" : "scale-105"
            }`}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
        </div>

        {/* Collection Headline */}
        <div
          className={`absolute bottom-28 left-6 lg:left-12 transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-[11px] font-sans font-medium tracking-[0.2em] text-text-tertiary uppercase mb-4">
            Spring 2026
          </p>
          <h1 className="font-serif font-light text-4xl lg:text-5xl xl:text-6xl text-foreground tracking-[0.06em] leading-[1.1]">
            The Cyme
            <br />
            Collection
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] text-text-tertiary uppercase">Scroll</span>
            <div className="w-[1px] h-8 bg-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Strip */}
      <div
        className={`border-t border-b border-border bg-surface-2 transition-all duration-700 delay-200 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-center gap-5 px-6 lg:px-12 py-4">
          <div className="relative w-[60px] h-[60px] shrink-0 overflow-hidden">
            <ImageWithSkeleton
              src="/images/hero-bag.jpg"
              alt="Cyme bag"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.15em] text-primary uppercase mb-0.5">The Icon</p>
            <p className="font-serif text-lg text-foreground">Cyme</p>
            <p className="text-[12px] text-text-tertiary tracking-wide">$620</p>
          </div>
          <Link
            href="/product/2"
            className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background text-[11px] tracking-[0.15em] uppercase hover:bg-primary transition-colors group shrink-0"
          >
            Discover
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </>
  )
}
