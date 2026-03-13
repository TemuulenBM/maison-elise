"use client"

import { useEffect, useRef, useState } from "react"
import { ImageWithSkeleton } from "./image-with-skeleton"

const stats = [
  { value: "50+", label: "Years of Excellence" },
  { value: "100%", label: "Italian Leather" },
  { value: "Hand", label: "Crafted" },
]

export function BrandStory() {
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
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 lg:py-40 bg-surface-2">
      <div className="px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Text Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-[11px] font-sans font-medium tracking-[0.2em] text-text-tertiary uppercase mb-6">
              Our Heritage
            </p>

            <h2 className="font-serif font-light text-3xl lg:text-5xl text-foreground leading-tight mb-0">
              A Legacy of
              <br />
              Artisanal Excellence
            </h2>

            <div className="w-12 h-[1px] bg-primary my-8" />

            <p className="text-[15px] text-text-tertiary leading-relaxed font-sans mb-4">
              Since its founding, Maison Élise has been devoted to the art of leather
              craftsmanship. Each piece is born from the hands of master artisans in our
              Florentine atelier, where tradition meets contemporary vision.
            </p>

            <p className="text-[15px] text-text-tertiary leading-relaxed font-sans mb-12">
              We source only the finest Italian leathers, selected for their character and
              durability. Our commitment to excellence means every stitch, every edge, every
              detail is considered — because true luxury lies in what you cannot see.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl text-primary mb-2">{stat.value}</p>
                  <p className="text-[10px] tracking-[0.15em] text-text-tertiary uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image with Quote */}
          <div
            className={`transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <ImageWithSkeleton
                src="/images/editorial-2.jpg"
                alt="Maison Élise craftsmanship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />

              {/* Quote Overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-serif italic text-lg lg:text-xl text-foreground/90 leading-relaxed">
                  &ldquo;The beauty of craft lies in the imperfection of human touch.&rdquo;
                </p>
                <p className="text-[10px] tracking-[0.15em] text-text-tertiary uppercase mt-3">
                  — Élise Beaumont, Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
