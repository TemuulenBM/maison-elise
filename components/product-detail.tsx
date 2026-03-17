"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, ChevronLeft, ChevronRight, Box, Truck, RotateCcw, Pen } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { ImageZoom } from "@/components/product/image-zoom"
import type { DisplayProduct } from "@/lib/adapters"

const tabs = [
  { id: "description" as const, label: "Description" },
  { id: "details" as const, label: "Details" },
  { id: "materials" as const, label: "Materials" },
  { id: "delivery" as const, label: "Shipping & Care" },
]

export function ProductDetail({ product }: { product: DisplayProduct }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [activeTab, setActiveTab] = useState<"description" | "details" | "materials" | "delivery">("description")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMonogramOpen, setIsMonogramOpen] = useState(false)
  const [monogramText, setMonogramText] = useState("")
  const [monogramFont, setMonogramFont] = useState<"classic" | "script">("classic")
  const [monogramPosition, setMonogramPosition] = useState<"front" | "interior">("front")
  const { addToCart } = useCart()

  const tabContent = {
    description: product.description,
    details: product.details,
    materials: product.materials,
    delivery: "Complimentary shipping on all orders. Express delivery available upon request. We welcome exchanges within 30 days — pieces must be unworn with original packaging.",
  }

  return (
    <section className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left - Images */}
        <div className="relative bg-card">
          <div className="aspect-[3/4] lg:aspect-auto lg:h-screen lg:sticky lg:top-0">
            <ImageZoom
              src={selectedColor?.image || product.image}
              alt={product.name}
            />

            {/* Image Navigation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
              <button
                type="button"
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                className="p-2 bg-background/80 text-foreground hover:bg-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[12px] text-foreground">
                {currentImageIndex + 1} / {product.colors.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentImageIndex(Math.min(product.colors.length - 1, currentImageIndex + 1))}
                className="p-2 bg-background/80 text-foreground hover:bg-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="p-6 lg:p-12 lg:pt-24">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] text-text-tertiary hover:text-foreground transition-colors uppercase mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Return to Collection
          </Link>

          {/* Product Title */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-2">
              {product.name}
            </h1>
            <p className="text-[13px] text-text-tertiary uppercase tracking-wide mb-4">
              {product.edition}
            </p>
            <p className="font-serif text-2xl text-primary">
              ${product.price}
            </p>
          </div>

          {/* Color Selector */}
          <div className="mb-8">
            <p className="text-[11px] tracking-[0.15em] text-text-tertiary uppercase mb-4">
              Color — <span className="text-foreground">{selectedColor.name}</span>
            </p>
            <div className="flex items-center gap-4">
              {product.colors.map((color) => (
                <button
                  type="button"
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color)
                    setCurrentImageIndex(product.colors.indexOf(color))
                  }}
                  className={`w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 ${
                    selectedColor.name === color.name
                      ? "border-2 border-primary scale-110"
                      : "border border-border hover:border-text-tertiary"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              <button type="button" className="text-[12px] text-foreground underline underline-offset-4 decoration-border hover:text-primary hover:decoration-primary transition-colors ml-6">
                Explore all ({product.colors.length})
              </button>
            </div>
          </div>

          {/* 3D View Button */}
          <button type="button" className="w-full py-3 mb-4 border border-border text-foreground text-[11px] tracking-[0.15em] uppercase hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
            <Box className="w-4 h-4" />
            3D View
          </button>

          {/* Personalization */}
          <div className="mb-4 border border-border">
            <button
              type="button"
              onClick={() => setIsMonogramOpen(!isMonogramOpen)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface-3 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Pen className="w-4 h-4 text-primary" />
                <span className="text-[11px] tracking-[0.15em] text-foreground uppercase">
                  Personalise with Monogram
                </span>
              </div>
              <span className="text-[11px] tracking-[0.1em] text-primary">
                Complimentary
              </span>
            </button>

            {isMonogramOpen && (
              <div className="px-4 pb-5 pt-1 border-t border-border">
                <p className="text-[12px] text-text-tertiary mb-4">
                  Up to three initials, hand-stamped in gold foil by our artisans.
                </p>

                {/* Initials Input */}
                <input
                  type="text"
                  value={monogramText}
                  onChange={(e) => setMonogramText(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3))}
                  placeholder="ABC"
                  maxLength={3}
                  className="w-full bg-transparent border-b border-border text-center text-2xl font-serif tracking-[0.3em] text-foreground placeholder:text-border py-3 mb-5 focus:outline-none focus:border-primary transition-colors uppercase"
                />

                {/* Font Style */}
                <p className="text-[10px] tracking-[0.15em] text-text-tertiary uppercase mb-2">Lettering</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => setMonogramFont("classic")}
                    className={`py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                      monogramFont === "classic"
                        ? "border border-primary text-primary"
                        : "border border-border text-text-tertiary hover:border-text-tertiary"
                    }`}
                  >
                    Classic
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonogramFont("script")}
                    className={`py-2.5 text-[11px] tracking-[0.1em] transition-colors ${
                      monogramFont === "script"
                        ? "border border-primary text-primary italic"
                        : "border border-border text-text-tertiary hover:border-text-tertiary italic"
                    }`}
                  >
                    Script
                  </button>
                </div>

                {/* Position */}
                <p className="text-[10px] tracking-[0.15em] text-text-tertiary uppercase mb-2">Placement</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => setMonogramPosition("front")}
                    className={`py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                      monogramPosition === "front"
                        ? "border border-primary text-primary"
                        : "border border-border text-text-tertiary hover:border-text-tertiary"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonogramPosition("interior")}
                    className={`py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                      monogramPosition === "interior"
                        ? "border border-primary text-primary"
                        : "border border-border text-text-tertiary hover:border-text-tertiary"
                    }`}
                  >
                    Interior
                  </button>
                </div>

                {/* Preview */}
                {monogramText && (
                  <p className="text-[12px] text-text-tertiary text-center">
                    Preview:{" "}
                    <span className={`text-foreground ${monogramFont === "script" ? "italic font-serif" : "font-serif tracking-[0.2em]"}`}>
                      {monogramText.split("").join(".")}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4 mb-10">
            <button
              type="button"
              onClick={() => addToCart(product.variantMap[selectedColor.name] ?? product.defaultVariantId)}
              className="flex-1 py-4 bg-foreground text-background text-[11px] tracking-[0.15em] uppercase hover:bg-primary transition-colors"
            >
              Add to My Selection
            </button>
            <button type="button" className="p-4 border border-border text-foreground hover:text-primary hover:border-primary transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-t border-border">
            <div className="flex flex-wrap gap-6 py-4">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[11px] tracking-[0.1em] uppercase transition-colors pb-2 border-b-2 ${
                    activeTab === tab.id
                      ? "text-foreground border-primary"
                      : "text-text-tertiary border-transparent hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="py-6">
              <p className="text-[14px] text-text-tertiary leading-relaxed">
                {tabContent[activeTab]}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-[10px] text-text-tertiary">Complimentary Shipping</p>
            </div>
            <div className="text-center">
              <Box className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-[10px] text-text-tertiary">Signature Gift Wrapping</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-[10px] text-text-tertiary">Easy Exchanges</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
