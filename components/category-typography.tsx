"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const categories = [
  { name: "HANDBAGS", subtitle: "Totes, Crossbody & Clutches", href: "/collection" },
  { name: "JEWELLERY", subtitle: "Rings, Bracelets & Necklaces", href: "/collection" },
  { name: "SMALL LEATHER GOODS", subtitle: "Wallets, Cardholders & Pouches", href: "/collection" },
]

export function CategoryTypography() {
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
    <section
      ref={sectionRef}
      className="py-32 lg:py-40 bg-background overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div
          className={`text-center mb-16 lg:mb-20 transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <p className="text-[11px] font-sans font-medium tracking-[0.2em] text-text-tertiary uppercase">
            Explore
          </p>
        </div>

        {/* Category List */}
        <div className="flex flex-col items-center">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group relative block text-center py-8 lg:py-12 transition-all duration-700 hover:-translate-y-0.5 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Number */}
              <span className="block text-[11px] font-sans tracking-[0.2em] text-text-tertiary group-hover:text-primary transition-colors duration-500 mb-4">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Category Name */}
              <span className="block font-serif font-light text-3xl sm:text-5xl lg:text-6xl xl:text-[72px] text-foreground tracking-[0.12em] leading-none group-hover:text-primary transition-colors duration-500">
                {category.name}
              </span>

              {/* Subtitle */}
              <span className="block mt-4 text-[12px] font-sans tracking-[0.1em] text-text-tertiary group-hover:text-primary/70 transition-colors duration-500">
                {category.subtitle}
              </span>

              {/* Divider */}
              <span className="block w-12 h-[1px] bg-border mx-auto mt-8 group-hover:bg-primary group-hover:w-20 transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
