"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageWithSkeleton } from "./image-with-skeleton"
import Link from "next/link"
import { Heart, ShoppingBag, Grid3X3, LayoutGrid, SlidersHorizontal } from "lucide-react"
import { useCart } from "@/context/cart-context"
import type { DisplayProduct } from "@/lib/adapters"

const filters = {
  category: ["Handbags", "Crossbody", "Shoulder bags", "Tote bags", "Mini bags"],
  color: ["Black", "Brown", "Camel", "Taupe", "Burgundy"],
  price: ["Under $500", "$500 - $600", "$600 - $700", "Over $700"],
}

export function CollectionContent({ products }: { products: DisplayProduct[] }) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl lg:text-4xl text-foreground">Bestsellers</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-primary transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters (0)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "grid" ? "compact" : "grid")}
                className="text-muted-foreground hover:text-primary transition-colors"
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

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {Object.entries(filters).map(([key, values]) => (
                  <div key={key}>
                    <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-4">
                      {key}
                    </h3>
                    <div className="space-y-2">
                      {values.map((item) => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer group/filter">
                          <div className="w-4 h-4 border border-border group-hover/filter:border-primary transition-colors" />
                          <span className="text-[12px] text-muted-foreground group-hover/filter:text-foreground transition-colors">
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <div
              className={`grid gap-6 ${
                showFilters
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="relative bg-card overflow-hidden mb-4 cursor-pointer aspect-square">
                      {/* Primary Image */}
                      <ImageWithSkeleton
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
                            addToCart(product.defaultVariantId)
                          }}
                          className="p-2.5 bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-background transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => e.preventDefault()}
                          className="p-2.5 bg-background/90 backdrop-blur-sm text-foreground hover:text-primary transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <p className="text-[11px] tracking-[0.1em] text-foreground uppercase group-hover:text-primary transition-colors duration-500">
                      {product.name}
                    </p>
                    <p className="text-[10px] tracking-[0.05em] text-muted-foreground uppercase">
                      {product.edition}
                    </p>
                    <p className="text-[12px] text-foreground">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
