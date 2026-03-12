"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const categories = [
  { name: "HANDBAGS", href: "/collection", offset: 0 },
  { name: "JEWELLERY", href: "/collection", offset: 100 },
  { name: "SMALL LEATHER GOODS", href: "/collection", offset: 200 },
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
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-background overflow-hidden"
    >
      <div className="px-6 lg:px-12">
        <div className="flex flex-col items-center">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group relative py-4 lg:py-6 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${category.offset}ms`,
              }}
            >
              <span className="font-serif text-5xl sm:text-7xl lg:text-[100px] xl:text-[120px] text-foreground tracking-[-0.02em] leading-none group-hover:text-primary transition-colors duration-500">
                {category.name}
              </span>
              <span className="absolute bottom-2 lg:bottom-4 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
