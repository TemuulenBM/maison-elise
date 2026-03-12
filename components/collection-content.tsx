"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Grid3X3, LayoutGrid, SlidersHorizontal } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { products } from "@/data/products"

const filters = {
  category: ["Handbags", "Crossbody", "Shoulder bags", "Tote bags", "Mini bags"],
  color: ["Black", "Brown", "Camel", "Taupe", "Burgundy"],
  price: ["Under $500", "$500 - $600", "$600 - $700", "Over $700"],
}

export function CollectionContent() {
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
                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-4 h-4 border border-border group-hover:border-primary transition-colors" />
                          <span className="text-[12px] text-muted-foreground group-hover:text-foreground transition-colors">
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
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {hoveredProduct === product.id && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center gap-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              addToCart(product, product.colors[0]?.name)
                            }}
                            className="p-3 bg-foreground text-background hover:bg-primary transition-colors"
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => e.preventDefault()}
                            className="p-3 bg-card text-foreground hover:text-primary transition-colors border border-border"
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="space-y-1">
                    <p className="text-[11px] tracking-[0.1em] text-foreground uppercase">
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
