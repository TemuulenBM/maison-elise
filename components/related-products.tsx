"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { products } from "@/data/products"

export function RelatedProducts({ currentProductId }: { currentProductId: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { addToCart } = useCart()

  const relatedProducts = products.filter((p) => p.id !== currentProductId)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="px-6 lg:px-12">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <p className="text-[11px] font-sans font-medium tracking-[0.2em] text-text-tertiary uppercase mb-4">
            Discover More
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
            You May Also Like
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${Math.min(index * 80, 300)}ms` }}
            >
              {/* Product Image */}
              <Link
                href={`/product/${product.id}`}
                className="relative block bg-card overflow-hidden mb-4 aspect-square"
              >
                {/* Primary Image */}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />

                {/* Hover Image — second color */}
                {product.colors[1] && (
                  <Image
                    src={product.colors[1].image}
                    alt={`${product.name} - ${product.colors[1].name}`}
                    fill
                    className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  />
                )}

                {/* Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addToCart(product, product.colors[0]?.name)
                    }}
                    className="p-2.5 bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-background transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    className="p-2.5 bg-background/90 backdrop-blur-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </Link>

              {/* Product Info */}
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.1em] text-foreground uppercase group-hover:text-primary transition-colors duration-500">
                  {product.name}
                </p>
                <p className="text-[10px] tracking-[0.05em] text-text-tertiary uppercase">
                  {product.edition}
                </p>
                <p className="text-[12px] text-foreground">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
