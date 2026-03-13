"use client"

import { useEffect, useRef, useState } from "react"
import { ImageWithSkeleton } from "./image-with-skeleton"

export function EditorialSection() {
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
    <section ref={sectionRef} className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Image */}
        <div
          className={`relative h-[60vh] lg:h-[80vh] overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <ImageWithSkeleton
            src="/images/editorial-1.jpg"
            alt="Fashion editorial"
            fill
            className="object-cover hover:scale-105 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
        </div>

        {/* Right Image */}
        <div
          className={`relative h-[60vh] lg:h-[80vh] overflow-hidden transition-all duration-700 delay-150 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          <ImageWithSkeleton
            src="/images/editorial-2.jpg"
            alt="Fashion editorial"
            fill
            className="object-cover hover:scale-105 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
