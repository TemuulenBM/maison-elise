"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ImageWithSkeleton } from "./image-with-skeleton"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { EASE_LUXURY } from "@/lib/animations"

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Parallax: зураг доош хөдөлнө scroll-ийн дагуу
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])

  return (
    <>
      <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
        {/* Background Image with parallax */}
        <motion.div className="absolute inset-0 scale-110" style={{ y: imageY }}>
          <ImageWithSkeleton
            src="/images/hero-model.jpg"
            alt="Luxury bag campaign"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
        </motion.div>

        {/* Collection Headline */}
        <div className="absolute bottom-28 left-6 lg:left-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_LUXURY, delay: 0.4 }}
            className="text-[11px] font-sans font-medium tracking-[0.2em] text-text-tertiary uppercase mb-4"
          >
            Spring 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_LUXURY, delay: 0.55 }}
            className="font-serif font-light text-4xl lg:text-5xl xl:text-6xl text-foreground tracking-[0.06em] leading-[1.1]"
          >
            The Cyme
            <br />
            Collection
          </motion.h1>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] text-text-tertiary uppercase">Scroll</span>
            <div className="w-[1px] h-8 bg-border relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-1/2 bg-primary"
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Product Strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXURY, delay: 0.2 }}
        className="border-t border-b border-border bg-surface-2"
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
      </motion.div>
    </>
  )
}
