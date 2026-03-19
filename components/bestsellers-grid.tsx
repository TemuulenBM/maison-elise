"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageWithSkeleton } from "./image-with-skeleton"
import Link from "next/link"
import { Heart, ShoppingBag, Grid3X3, LayoutGrid } from "lucide-react"
import { useCart } from "@/context/cart-context"
import type { DisplayProduct } from "@/lib/adapters"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function BestsellersGrid({ products }: { products: DisplayProduct[] }) {
  const [, setHoveredProduct] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid")
  const { addToCart } = useCart()

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Most Coveted</h2>
            <div className="w-12 h-px bg-[#C9A96E] mt-4" />
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/collection"
              className="text-[11px] tracking-[0.15em] text-text-tertiary hover:text-primary transition-colors uppercase"
            >
              Explore the Collection
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-tertiary">Filter</span>
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
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          }`}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={item}
              className="group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="border border-[#2A2A28] p-px mb-4">
                <div className="border border-white/5">
                  <Link
                    href={`/product/${product.id}`}
                    className={`relative block bg-card overflow-hidden ${
                      viewMode === "grid" ? "aspect-square" : "aspect-[3/4]"
                    }`}
                  >
                    {/* Primary Image */}
                    <ImageWithSkeleton
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-[1.03]"
                    />

                    {/* Hover Image — second color */}
                    {product.colors[1] && (
                      <Image
                        src={product.colors[1].image}
                        alt={`${product.name} - ${product.colors[1].name}`}
                        fill
                        className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                          addToCart(product.defaultVariantId)
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
                        className="p-2.5 bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-background transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <p className="text-[11px] tracking-[0.15em] text-foreground uppercase group-hover:text-primary transition-colors duration-500">
                  {product.name}
                </p>
                <p className="text-[10px] tracking-[0.05em] text-text-tertiary uppercase">
                  {product.edition}
                </p>
                <p className="text-[12px] text-foreground">${product.price}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
