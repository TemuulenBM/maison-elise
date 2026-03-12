"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MagazineSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-background">
      <div className="px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Magazine Image */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/magazine.jpg"
                alt="Longue Vue Magazine"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-[11px] tracking-[0.2em] text-text-tertiary uppercase mb-6">
              CYME TOTE & CYME TOTE NANO
            </p>

            <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-6 leading-tight">
              Longue Vue, the magazine where a closer look broadens the horizon.
            </h2>

            <p className="text-[15px] text-text-tertiary leading-relaxed mb-8 font-sans">
              In its annual publication Longue Vue, Maison Élise shines the spotlight on its creative
              adventures. The first edition, &ldquo;Play of Perspectives&rdquo;, uses words, illustrations,
              photographs, and even maps to look back on the year&apos;s explorations.
            </p>

            <Link
              href="/collection"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.15em] text-foreground uppercase hover:text-primary transition-colors group"
            >
              Explore Longue Vue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
