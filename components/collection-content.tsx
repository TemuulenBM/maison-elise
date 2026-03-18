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
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name A–Z" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] as const },
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
                <SelectTrigger className="h-8 border-border bg-transparent text-[11px] tracking-[0.1em] text-muted-foreground uppercase rounded-none w-[180px]">
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
            <div className="flex items-center border border-border">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${viewMode === "grid" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                className={`p-1.5 transition-colors ${viewMode === "compact" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
                title="Compact view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
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
                      ? viewMode === "compact"
                        ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : viewMode === "compact"
                        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }`}
                >
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className="group"
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    >
                      <Link href={`/product/${product.id}`}>
                        {/* Double-bezel */}
                        <div className="border border-[#2A2A28] p-px mb-4">
                          <div className={`border border-white/5 relative bg-card overflow-hidden cursor-pointer ${viewMode === "compact" ? "aspect-[3/4]" : "aspect-square"}`}>
                            {/* Images — scale via CSS to avoid nested whileHover conflict */}
                            <div className="absolute inset-0">
                              <ImageWithSkeleton
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                              />
                              {product.colors[1] && (
                                <Image
                                  src={product.colors[1].image}
                                  alt={`${product.name} - ${product.colors[1].name}`}
                                  fill
                                  className="absolute inset-0 object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]"
                                />
                              )}
                            </div>

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                            {/* Slide-up editorial bar */}
                            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 px-4 pt-8 pb-4 z-20">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                                  Quick Add
                                </span>
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      addToCart(product.defaultVariantId)
                                    }}
                                    className="p-2 bg-white/10 backdrop-blur-sm text-white hover:bg-primary hover:text-background transition-colors duration-300"
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => e.preventDefault()}
                                    className="p-2 bg-white/10 backdrop-blur-sm text-white hover:text-primary transition-colors duration-300"
                                  >
                                    <Heart className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div className="space-y-1 px-px">
                        <p className="text-[11px] tracking-[0.15em] text-foreground uppercase group-hover:text-primary transition-colors duration-500">
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
