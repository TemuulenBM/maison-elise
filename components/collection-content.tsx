"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Heart, ShoppingBag, Grid3X3, LayoutGrid, SlidersHorizontal, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/cart-context"
import { ImageWithSkeleton } from "./image-with-skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import type { DisplayProduct } from "@/lib/adapters"

interface CollectionContentProps {
  products: DisplayProduct[]
  title?: string
  subcategories?: { slug: string; name: string }[]
  activeCategory?: string
  activeSort?: string
  currentPage?: number
  totalPages?: number
  totalProducts?: number
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "name_asc", label: "Name A-Z" },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08, // PDF 8.2 spec
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }, // PDF 8.2 spec
  },
}

function FilterSidebar({
  subcategories,
  activeCategory,
  onFilterChange,
}: {
  subcategories?: { slug: string; name: string }[]
  activeCategory?: string
  onFilterChange: (key: string, value: string) => void
}) {
  return (
    <div className="space-y-8">
      {subcategories && subcategories.length > 0 && (
        <div>
          <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-4">Category</h3>
          <div className="space-y-2">
            {subcategories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onFilterChange("category", cat.slug)}
                className={`block w-full text-left text-[12px] py-1.5 transition-colors ${
                  activeCategory === cat.slug
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color filter — coming soon */}
      <div>
        <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-4">Color</h3>
        <div className="space-y-2">
          {["Black", "Brown", "Camel", "Taupe", "Burgundy"].map((color) => (
            <div key={color} className="flex items-center gap-3 opacity-40 cursor-not-allowed">
              <div className="w-4 h-4 border border-border" />
              <span className="text-[12px] text-muted-foreground">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price filter — coming soon */}
      <div>
        <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-4">Price</h3>
        <div className="space-y-2">
          {["Under $500", "$500 - $600", "$600 - $700", "Over $700"].map((price) => (
            <div key={price} className="flex items-center gap-3 opacity-40 cursor-not-allowed">
              <div className="w-4 h-4 border border-border" />
              <span className="text-[12px] text-muted-foreground">{price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CollectionContent({
  products,
  title = "Collection",
  subcategories,
  activeCategory,
  activeSort = "newest",
  currentPage = 1,
  totalPages = 1,
  totalProducts = 0,
}: CollectionContentProps) {
  const [, setHoveredProduct] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeFilterCount = activeCategory ? 1 : 0

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function handleLoadMore() {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(currentPage + 1))
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function clearFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl text-foreground">{title}</h1>
            {totalProducts > 0 && (
              <p className="text-[11px] text-muted-foreground mt-1 tracking-wide">
                {totalProducts} {totalProducts === 1 ? "product" : "products"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Sort — desktop */}
            <div className="hidden sm:block">
              <Select value={activeSort} onValueChange={handleSortChange}>
                <SelectTrigger className="h-8 border-border bg-transparent text-[11px] tracking-[0.1em] text-muted-foreground uppercase rounded-none w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-border bg-background">
                  {sortOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-[11px] tracking-[0.1em] uppercase rounded-none"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter toggle — desktop */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="hidden lg:flex items-center gap-2 text-[11px] text-muted-foreground hover:text-primary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 text-primary">({activeFilterCount})</span>
                )}
              </span>
            </button>

            {/* Filter toggle — mobile (Drawer) */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="lg:hidden flex items-center gap-2 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {activeFilterCount > 0 && (
                    <span className="text-primary">({activeFilterCount})</span>
                  )}
                </button>
              </DrawerTrigger>
              <DrawerContent className="rounded-none border-border">
                <DrawerHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <DrawerTitle className="text-[11px] tracking-[0.15em] uppercase font-normal">
                      Filters
                    </DrawerTitle>
                    <DrawerClose className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                <div className="p-6 overflow-y-auto">
                  {/* Sort — mobile */}
                  <div className="mb-8">
                    <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-4">
                      Sort by
                    </h3>
                    <div className="space-y-2">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSortChange(opt.value)}
                          className={`block w-full text-left text-[12px] py-1.5 transition-colors ${
                            activeSort === opt.value
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <FilterSidebar
                    subcategories={subcategories}
                    activeCategory={activeCategory}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </DrawerContent>
            </Drawer>

            {/* View mode toggle */}
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

        {/* Active filter chips */}
        <AnimatePresence>
          {activeCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {activeCategory && (
                <button
                  type="button"
                  onClick={() => clearFilter("category")}
                  className="flex items-center gap-1.5 px-3 py-1 border border-primary text-primary text-[11px] tracking-[0.1em] uppercase hover:bg-primary hover:text-background transition-colors"
                >
                  {subcategories?.find((c) => c.slug === activeCategory)?.name ?? activeCategory}
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-8">
          {/* Filters Sidebar — desktop */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 256 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="hidden lg:block flex-shrink-0 overflow-hidden"
              >
                <div className="sticky top-24 w-64">
                  <FilterSidebar
                    subcategories={subcategories}
                    activeCategory={activeCategory}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid or Empty State */}
          <div className="flex-1">
            {products.length === 0 ? (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 blur-3xl" />
                  <p className="relative text-[11px] tracking-[0.3em] text-primary uppercase">
                    Coming Soon
                  </p>
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl text-foreground font-light mb-4">
                  Something Extraordinary
                </h2>
                <p className="text-[13px] text-muted-foreground max-w-md mb-10 leading-relaxed">
                  Our artisans are crafting pieces that embody the essence of timeless luxury. Be
                  the first to discover our latest creations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/collection"
                    className="text-[11px] tracking-[0.15em] text-primary border border-primary px-8 py-3 hover:bg-primary hover:text-background transition-colors uppercase"
                  >
                    Explore Collection
                  </Link>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  key={`${activeCategory}-${activeSort}-${currentPage}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`grid gap-6 ${
                    showFilters
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }`}
                >
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className="group"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <Link href={`/product/${product.id}`}>
                        <div className="relative bg-card overflow-hidden mb-4 cursor-pointer aspect-square">
                          <ImageWithSkeleton
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                          />

                          {product.colors[1] && (
                            <Image
                              src={product.colors[1].image}
                              alt={`${product.name} - ${product.colors[1].name}`}
                              fill
                              className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                            />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination — View More */}
                {currentPage < totalPages && (
                  <div className="flex flex-col items-center mt-16">
                    <p className="text-[11px] text-muted-foreground mb-4 tracking-wide">
                      Showing {products.length} of {totalProducts} products
                    </p>
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="text-[11px] tracking-[0.15em] text-primary border border-primary px-10 py-3 hover:bg-primary hover:text-background transition-colors uppercase"
                    >
                      View More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
