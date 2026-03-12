"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const images = [
  { src: "/images/instagram-1.jpg", alt: "Craftsmanship" },
  { src: "/images/instagram-2.jpg", alt: "Street style" },
  { src: "/images/instagram-3.jpg", alt: "Accessories" },
  { src: "/images/instagram-4.jpg", alt: "Boutique" },
  { src: "/images/editorial-1.jpg", alt: "Editorial" },
  { src: "/images/product-model.jpg", alt: "Campaign" },
]

export function InstagramSection() {
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
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[11px] tracking-[0.2em] text-text-tertiary uppercase mb-4">
            @maison_elise
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-6">
            Follow us on Instagram
          </h2>
          <button type="button" className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] text-text-tertiary hover:text-primary transition-colors uppercase group">
            Our Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square overflow-hidden group cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
