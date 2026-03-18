"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search } from "lucide-react"
import type { DisplayProduct } from "@/lib/adapters"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  { name: "Handbags", href: "/bags" },
  { name: "Jewellery", href: "/jewellery" },
  { name: "Accessories", href: "/accessories" },
]

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<DisplayProduct[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus on open, reset on close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  // Debounced search — 300ms
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=6`)
        const data = await res.json()
        setResults(data.products ?? [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 lg:top-8 lg:right-12 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl mx-auto pt-28 lg:pt-36 px-6">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for pieces..."
                className="w-full bg-transparent pl-8 pb-3 text-xl lg:text-2xl font-serif font-light text-foreground placeholder:text-muted-foreground border-b border-border focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Gold accent line — expands on typing */}
            <motion.div
              className="h-px bg-primary"
              initial={{ width: 0 }}
              animate={{ width: query ? "100%" : 48 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            />

            <div className="mt-10">
              {/* Empty state — category explore */}
              {!query && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <p className="text-[11px] tracking-[0.2em] text-text-tertiary uppercase mb-6">
                    Explore
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={onClose}
                        className="px-5 py-2 border border-border text-[11px] tracking-[0.1em] text-muted-foreground hover:border-primary hover:text-primary transition-colors uppercase"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* No results */}
              {query && query.length >= 2 && !loading && results.length === 0 && (
                <p className="text-[13px] text-muted-foreground">
                  No results for{" "}
                  <span className="text-foreground">&ldquo;{query}&rdquo;</span>
                </p>
              )}

              {/* Product results */}
              {results.length > 0 && (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={onClose}
                      className="group"
                    >
                      <div className="border border-[#2A2A28] p-px mb-2">
                        <div className="border border-white/5 relative aspect-square bg-card overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] tracking-[0.1em] text-foreground uppercase group-hover:text-primary transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        ${product.price}
                      </p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
