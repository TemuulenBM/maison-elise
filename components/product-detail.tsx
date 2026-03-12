"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ChevronLeft, ChevronRight, Box, Truck, RotateCcw } from "lucide-react"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/types"

const tabs = [
  { id: "description" as const, label: "Description" },
  { id: "details" as const, label: "Details" },
  { id: "materials" as const, label: "Materials" },
  { id: "delivery" as const, label: "Delivery & Returns" },
]

export function ProductDetail({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [activeTab, setActiveTab] = useState<"description" | "details" | "materials" | "delivery">("description")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart } = useCart()

  const tabContent = {
    description: product.description,
    details: product.details,
    materials: product.materials,
    delivery: "Free standard shipping on all orders over $500. Express shipping available. Returns accepted within 30 days of delivery. Items must be in original condition with all tags attached.",
  }

  return (
    <section className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left - Images */}
        <div className="relative bg-card">
          <div className="aspect-[3/4] lg:aspect-auto lg:h-screen lg:sticky lg:top-0">
            <Image
              src={selectedColor?.image || product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />

            {/* Image Navigation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
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
            Back to Collection
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

          {/* Add to Cart */}
          <div className="flex gap-4 mb-10">
            <button
              type="button"
              onClick={() => addToCart(product, selectedColor.name)}
              className="flex-1 py-4 bg-foreground text-background text-[11px] tracking-[0.15em] uppercase hover:bg-primary transition-colors"
            >
              Add to Cart
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
              <p className="text-[10px] text-text-tertiary">Free Shipping</p>
            </div>
            <div className="text-center">
              <Box className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-[10px] text-text-tertiary">Gift Packaging</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-[10px] text-text-tertiary">30-Day Returns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
