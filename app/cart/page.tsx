"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Minus, X, ShoppingBag, Loader2, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageWithSkeleton } from "@/components/image-with-skeleton"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
  const { items, isLoading, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart()

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24 lg:pb-32 px-6 lg:px-12">
        {/* Hero */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[11px] tracking-[0.3em] text-primary uppercase mb-4">
            Your Selection
          </p>
          <div className="flex items-baseline gap-4">
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground font-light">
              Your Bag
            </h1>
            {!isLoading && totalItems > 0 && (
              <span className="text-[13px] text-muted-foreground">
                {totalItems} {totalItems === 1 ? "piece" : "pieces"}
              </span>
            )}
          </div>
          <div className="w-12 h-px bg-primary mt-6" />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="w-16 h-16 text-border mb-6" />
            <p className="font-serif text-2xl text-foreground font-light mb-3">
              Your selection is empty
            </p>
            <p className="text-[13px] text-muted-foreground mb-10 max-w-sm leading-relaxed">
              Explore our curated collections and discover pieces that speak to you.
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] hover:bg-primary transition-colors"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* Cart content */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 max-w-7xl">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-0"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  className="flex gap-5 py-8 border-b border-border"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="w-28 h-28 lg:w-32 lg:h-32 flex-shrink-0 relative overflow-hidden bg-card"
                  >
                    <div className="border border-[#2A2A28] p-px h-full">
                      <div className="border border-white/5 relative h-full overflow-hidden">
                        <ImageWithSkeleton
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link href={`/product/${item.productSlug}`}>
                          <p className="text-[12px] text-foreground uppercase tracking-[0.08em] hover:text-primary transition-colors">
                            {item.productName}
                          </p>
                        </Link>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {item.productEdition}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Color: {item.colorName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[12px] text-foreground w-8 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-serif text-lg text-foreground">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Continue shopping */}
              <div className="pt-8">
                <Link
                  href="/collection"
                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.1em]"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="lg:sticky lg:top-32">
                {/* Double-bezel summary card */}
                <div className="border border-[#2A2A28] p-px">
                  <div className="border border-white/5 bg-card p-6 lg:p-8 space-y-5">
                    <h2 className="font-serif text-xl text-foreground font-light tracking-[0.04em]">
                      Order Summary
                    </h2>

                    <div className="w-8 h-px bg-primary" />

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
                          Subtotal
                        </span>
                        <span className="text-[13px] text-foreground">
                          ${totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
                          Shipping
                        </span>
                        <span className="text-[12px] text-primary italic">
                          Complimentary
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
                          Estimated Tax
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Calculated at checkout
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-5 flex justify-between items-baseline">
                      <span className="text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
                        Estimated Total
                      </span>
                      <span className="font-serif text-2xl text-foreground font-light">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href="/checkout"
                      className="block w-full py-4 bg-foreground text-background text-[11px] tracking-[0.15em] uppercase hover:bg-primary transition-colors text-center mt-6"
                    >
                      Continue to Checkout
                    </Link>

                    <p className="text-[10px] text-muted-foreground text-center">
                      Secure checkout · SSL encrypted
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
