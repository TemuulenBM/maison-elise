"use client"

import { useState } from "react"
import type { Order, OrderItem, Profile } from "@/lib/generated/prisma"

type OrderWithRelations = Order & {
  user: Pick<Profile, "fullName">
  items: Pick<OrderItem, "id" | "quantity">[]
}

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "REFUNDED"] as const
type OrderStatus = (typeof ORDER_STATUSES)[number]

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "text-yellow-500 border-yellow-500/30",
  CONFIRMED: "text-blue-400 border-blue-400/30",
  PROCESSING: "text-blue-400 border-blue-400/30",
  SHIPPED: "text-primary border-primary/30",
  DELIVERED: "text-green-500 border-green-500/30",
  REFUNDED: "text-red-400 border-red-400/30",
}

export function AdminOrdersTable({ orders }: { orders: OrderWithRelations[] }) {
  const [items, setItems] = useState(orders)
  const [loading, setLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL")

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setLoading(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setItems((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
    } finally {
      setLoading(null)
    }
  }

  const filtered = filter === "ALL" ? items : items.filter((o) => o.status === filter)

  return (
    <div>
      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(["ALL", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] border transition-colors ${
              filter === s
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="border border-border">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_180px] gap-4 px-4 py-3 bg-surface-2 border-b border-border">
          {["Order ID", "Customer", "Items", "Total", "Date", "Status"].map((h) => (
            <div key={h} className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {h}
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-muted-foreground">No orders found.</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((order) => {
              const totalItems = order.items.reduce((s, i) => s + i.quantity, 0)
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_180px] gap-4 px-4 py-4 items-center hover:bg-surface-2 transition-colors"
                >
                  <div className="text-[11px] text-foreground font-mono">
                    {order.id.slice(0, 16)}...
                  </div>
                  <div className="text-[12px] text-foreground truncate">
                    {order.user.fullName ?? "—"}
                  </div>
                  <div className="text-[12px] text-foreground">
                    {totalItems}
                  </div>
                  <div className="text-[12px] text-foreground">
                    ${(order.totalAmount / 100).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div>
                    <select
                      value={order.status}
                      disabled={loading === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`w-full bg-surface-2 border px-2 py-1.5 text-[10px] uppercase tracking-[0.1em] focus:outline-none focus:border-primary transition-colors disabled:opacity-50 ${STATUS_COLORS[order.status as OrderStatus] ?? "border-border text-foreground"}`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-surface-2 text-foreground normal-case tracking-normal">
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
    </div>
  )
}
