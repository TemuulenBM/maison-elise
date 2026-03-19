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
    <div>
      {error && (
        <p className="text-[12px] text-red-400 mb-4">{error}</p>
      )}

      <div className="border border-border">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-surface-2 border-b border-border">
          {["Product", "Status", "Variants", "Base Price"].map((h) => (
            <div key={h} className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {h}
            </div>
          ))}
        </div>

        <div className="divide-y divide-border">
          {products.map((product) => (
            <div key={product.id}>
              {/* Product row */}
              <div
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-4 items-center hover:bg-surface-2 transition-colors cursor-pointer"
                onClick={() => setExpanded(expanded === product.id ? null : product.id)}
              >
                <div>
                  <p className="text-[13px] text-foreground">{product.name}</p>
                  {product.edition && (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.08em]">
                      {product.edition}
                    </p>
                  )}
                </div>
                <div>
                  <span className={`text-[10px] uppercase tracking-[0.1em] ${product.status === "ACTIVE" ? "text-green-500" : "text-muted-foreground"}`}>
                    {product.status}
                  </span>
                </div>
                <div className="text-[12px] text-foreground">
                  {product.variants.length}
                </div>
                <div className="text-[12px] text-foreground">
                  {formatPrice(product.basePrice)}
                </div>
              </div>

              {/* Expanded variant inventory */}
              {expanded === product.id && (
                <div className="border-t border-border bg-surface-2 px-4 py-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Variant Inventory
                  </p>
                  <div className="space-y-2">
                    {product.variants.map((variant) => {
                      // Prisma stores attributes as JsonValue; cast is safe because all variants
                      // are created with VariantAttributes shape via the product creation flow
                      const attrs = variant.attributes as unknown as VariantAttributes
                      const available = stocks[variant.id] - variant.reserved
                      return (
                        <div key={variant.id} className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-[11px] text-foreground">
                              {attrs?.color ?? variant.sku}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {variant.sku} · Available: {available < 0 ? 0 : available}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
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
                              className="w-20 bg-surface-3 border border-border px-2 py-1.5 text-[12px] text-foreground text-right focus:outline-none focus:border-primary"
                            />
                            <button
                              onClick={() => handleSaveStock(variant.id)}
                              disabled={saving === variant.id}
                              className="px-3 py-1.5 bg-foreground text-background text-[10px] uppercase tracking-[0.1em] hover:bg-primary transition-colors disabled:opacity-50"
                            >
                              {saving === variant.id ? "..." : "Save"}
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
                              className="px-3 py-1.5 border border-border text-[10px] uppercase tracking-[0.1em] text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                            >
                              {uploading === variant.id ? "..." : "Image"}
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
