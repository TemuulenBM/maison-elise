"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Grid3X3, LayoutGrid } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { products } from "@/data/products"

export function BestsellersGrid() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid")
  const sectionRef = useRef<HTMLElement>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
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
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Bestsellers</h2>
          <div className="flex items-center gap-6">
            <Link
              href="/collection"
              className="text-[11px] tracking-[0.15em] text-text-tertiary hover:text-primary transition-colors uppercase"
            >
              View All
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-tertiary">Filters (0)</span>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "grid" ? "compact" : "grid")}
                className="text-text-tertiary hover:text-primary transition-colors"
              >
                {viewMode === "grid" ? (
                  <Grid3X3 className="w-4 h-4" />
                ) : (
                  <LayoutGrid className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          }`}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group transition-all duration-600 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${Math.min(index * 70, 400)}ms` }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <Link
                href={`/product/${product.id}`}
                className={`relative block bg-card overflow-hidden mb-4 ${
                  viewMode === "grid" ? "aspect-square" : "aspect-[3/4]"
                }`}
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
