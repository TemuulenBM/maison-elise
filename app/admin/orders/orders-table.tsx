"use client"

import { useState } from "react"
import type { Order, OrderItem, Profile } from "@/lib/generated/prisma"
import { formatPrice } from "@/types"

type OrderWithRelations = Order & {
  user: Pick<Profile, "fullName">
  items: Pick<OrderItem, "id" | "quantity">[]
}

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "REFUNDED"] as const
type OrderStatus = (typeof ORDER_STATUSES)[number]

const STATUS_BADGE: Record<OrderStatus, string> = {
  PENDING:    "bg-[#F5F0E8] text-[#8B7355] border border-[#E8D9B8]",
  CONFIRMED:  "bg-[#E8F0F5] text-[#3A6B8B] border border-[#B8D5E8]",
  PROCESSING: "bg-[#E8F0F5] text-[#3A6B8B] border border-[#B8D5E8]",
  SHIPPED:    "bg-[#E8F0E8] text-[#3A6B3A] border border-[#B8D8B8]",
  DELIVERED:  "bg-[#F0F5E8] text-[#5A7A3A] border border-[#C8D8B0]",
  REFUNDED:   "bg-[#F5E8E8] text-[#8B4444] border border-[#D8B8B8]",
}

export function AdminOrdersTable({ orders }: { orders: OrderWithRelations[] }) {
  const [items, setItems] = useState(orders)
  const [loading, setLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL")
  const [error, setError] = useState<string | null>(null)

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setLoading(orderId)
    setError(null)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update order status")
      setItems((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
    } catch {
      setError("Failed to update order status. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const filtered = filter === "ALL" ? items : items.filter((o) => o.status === filter)

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["ALL", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all duration-200"
            style={{
              border: filter === s ? "1px solid #C9A96E" : "1px solid #E8E4DF",
              color: filter === s ? "#C9A96E" : "#6B6560",
              backgroundColor: filter === s ? "#FFFDF8" : "#FFFFFF",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-[12px]" style={{ color: "#8B4444" }}>{error}</p>
      )}

      {/* Table */}
      <div style={{ border: "1px solid #E8E4DF" }}>
        {/* Header */}
        <div
          className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_180px] gap-4 px-5 py-3"
          style={{ backgroundColor: "#FAFAF9", borderBottom: "1px solid #E8E4DF" }}
        >
          {["Order ID", "Customer", "Items", "Total", "Date", "Status"].map((h) => (
            <div key={h} className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "#9B9490" }}>
              {h}
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: "#9B9490", backgroundColor: "#FFFFFF" }}>
            No orders found.
          </div>
        ) : (
          <div>
            {filtered.map((order, i) => {
              const totalItems = order.items.reduce((s, it) => s + it.quantity, 0)
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_180px] gap-4 px-5 py-4 items-center transition-colors duration-150 hover:bg-[#FAFAF9]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderTop: i > 0 ? "1px solid #E8E4DF" : undefined,
                  }}
                >
                  <div className="text-[11px] font-mono" style={{ color: "#111111" }}>
                    {order.id.slice(0, 16)}…
                  </div>
                  <div className="text-sm truncate" style={{ color: "#111111" }}>
                    {order.user.fullName ?? "—"}
                  </div>
                  <div className="text-sm" style={{ color: "#111111" }}>
                    {totalItems}
                  </div>
                  <div className="text-sm font-mono" style={{ color: "#111111" }}>
                    {formatPrice(order.totalAmount)}
                  </div>
                  <div className="text-[11px]" style={{ color: "#6B6560" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div>
                    <select
                      value={order.status}
                      disabled={loading === order.id}
                      // Select returns a string; cast is safe since options are restricted to ORDER_STATUSES
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="w-full px-2 py-1.5 text-[10px] uppercase tracking-[0.1em] focus:outline-none transition-colors duration-200 disabled:opacity-50"
                      style={{
                        border: "1px solid #E8E4DF",
                        backgroundColor: "#FAFAF9",
                        color: "#111111",
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s} className="normal-case tracking-normal">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Status legend */}
      <div className="flex items-center gap-3 flex-wrap pt-1">
        {ORDER_STATUSES.map((s) => (
          <span
            key={s}
            className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] ${STATUS_BADGE[s]}`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
