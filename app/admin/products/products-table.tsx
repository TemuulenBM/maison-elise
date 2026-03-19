"use client"

import { useRef, useState } from "react"
import type { Product, ProductVariant } from "@/lib/generated/prisma"
import type { VariantAttributes } from "@/types"
import { formatPrice } from "@/types"

type VariantWithStock = Pick<ProductVariant, "id" | "sku" | "attributes" | "stockQuantity" | "reserved">
type ProductWithVariants = Product & { variants: VariantWithStock[] }

export function AdminProductsTable({ products }: { products: ProductWithVariants[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [stocks, setStocks] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    products.forEach((p) => p.variants.forEach((v) => { map[v.id] = v.stockQuantity }))
    return map
  })
  const [saving, setSaving] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  async function handleSaveStock(variantId: string) {
    setSaving(variantId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/products/${variantId}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: stocks[variantId] }),
      })
      if (!res.ok) throw new Error("Failed to update inventory")
    } catch {
      setError("Failed to save inventory. Please try again.")
    } finally {
      setSaving(null)
    }
  }

  async function handleImageUpload(productId: string, variantId: string, file: File) {
    setUploading(variantId)
    setError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("variantId", variantId)
      const res = await fetch(`/api/admin/products/${productId}/image`, { method: "POST", body: form })
      if (!res.ok) throw new Error("Failed to upload image")
    } catch {
      setError("Failed to upload image. Please try again.")
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-[12px]" style={{ color: "#8B4444" }}>{error}</p>
      )}

      <div style={{ border: "1px solid #E8E4DF" }}>
        {/* Header */}
        <div
          className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3"
          style={{ backgroundColor: "#FAFAF9", borderBottom: "1px solid #E8E4DF" }}
        >
          {["Product", "Status", "Variants", "Base Price"].map((h) => (
            <div key={h} className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "#9B9490" }}>
              {h}
            </div>
          ))}
        </div>

        <div>
          {products.map((product, i) => (
            <div key={product.id}>
              {/* Product row */}
              <div
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-4 items-center transition-colors duration-150 cursor-pointer hover:bg-[#FAFAF9]"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderTop: i > 0 ? "1px solid #E8E4DF" : undefined,
                }}
                onClick={() => setExpanded(expanded === product.id ? null : product.id)}
              >
                <div>
                  <p className="text-sm" style={{ color: "#111111" }}>{product.name}</p>
                  {product.edition && (
                    <p className="text-[10px] uppercase tracking-[0.08em] mt-0.5" style={{ color: "#9B9490" }}>
                      {product.edition}
                    </p>
                  )}
                </div>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.1em] px-2 py-0.5"
                    style={
                      product.status === "ACTIVE"
                        ? { backgroundColor: "#F0F5E8", color: "#5A7A3A", border: "1px solid #C8D8B0" }
                        : { backgroundColor: "#F5F0E8", color: "#8B7355", border: "1px solid #E8D9B8" }
                    }
                  >
                    {product.status}
                  </span>
                </div>
                <div className="text-sm" style={{ color: "#111111" }}>
                  {product.variants.length}
                </div>
                <div className="text-sm font-mono flex items-center justify-between" style={{ color: "#111111" }}>
                  {formatPrice(product.basePrice)}
                  <span className="text-[10px]" style={{ color: "#9B9490" }}>
                    {expanded === product.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded variant inventory */}
              {expanded === product.id && (
                <div
                  className="px-5 py-5"
                  style={{ backgroundColor: "#FAFAF9", borderTop: "1px solid #E8E4DF" }}
                >
                  <p className="text-[9px] uppercase tracking-[0.2em] mb-4" style={{ color: "#9B9490" }}>
                    Variant Inventory
                  </p>
                  <div className="space-y-3">
                    {product.variants.map((variant) => {
                      // Prisma stores attributes as JsonValue; cast is safe because all variants
                      // are created with VariantAttributes shape via the product creation flow
                      const attrs = variant.attributes as unknown as VariantAttributes
                      const available = stocks[variant.id] - variant.reserved
                      return (
                        <div
                          key={variant.id}
                          className="flex items-center gap-4 p-3"
                          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DF" }}
                        >
                          <div className="flex-1">
                            <p className="text-sm" style={{ color: "#111111" }}>
                              {attrs?.color ?? variant.sku}
                            </p>
                            <p className="text-[10px] mt-0.5 font-mono" style={{ color: "#6B6560" }}>
                              {variant.sku} · Available: {available < 0 ? 0 : available}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "#9B9490" }}>
                              Stock
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={stocks[variant.id] ?? 0}
                              onChange={(e) =>
                                setStocks((prev) => ({
                                  ...prev,
                                  [variant.id]: parseInt(e.target.value, 10) || 0,
                                }))
                              }
                              className="w-20 px-2 py-1.5 text-sm text-right focus:outline-none transition-colors duration-200"
                              style={{
                                border: "1px solid #E8E4DF",
                                backgroundColor: "#FAFAF9",
                                color: "#111111",
                              }}
                              onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A96E")}
                              onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E4DF")}
                            />
                            <button
                              onClick={() => handleSaveStock(variant.id)}
                              disabled={saving === variant.id}
                              className="px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] transition-all duration-200 disabled:opacity-50"
                              style={{ backgroundColor: "#111111", color: "#FFFFFF" }}
                            >
                              {saving === variant.id ? "…" : "Save"}
                            </button>
                            {/* Image upload */}
                            <input
                              ref={(el) => { fileInputRefs.current[variant.id] = el }}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(product.id, variant.id, file)
                                e.target.value = ""
                              }}
                            />
                            <button
                              onClick={() => fileInputRefs.current[variant.id]?.click()}
                              disabled={uploading === variant.id}
                              className="px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] transition-all duration-200 disabled:opacity-50"
                              style={{
                                border: "1px solid #E8E4DF",
                                color: "#6B6560",
                                backgroundColor: "#FFFFFF",
                              }}
                            >
                              {uploading === variant.id ? "…" : "Image"}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
