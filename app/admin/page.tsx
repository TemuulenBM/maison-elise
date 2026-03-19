import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/types"

export const metadata: Metadata = {
  title: "Admin | Maison Élise",
  robots: { index: false, follow: false },
}

const STATUS_BADGE: Record<string, string> = {
  PENDING:    "bg-[#F5F0E8] text-[#8B7355] border border-[#E8D9B8]",
  CONFIRMED:  "bg-[#E8F0F5] text-[#3A6B8B] border border-[#B8D5E8]",
  PROCESSING: "bg-[#E8F0F5] text-[#3A6B8B] border border-[#B8D5E8]",
  SHIPPED:    "bg-[#E8F0E8] text-[#3A6B3A] border border-[#B8D8B8]",
  DELIVERED:  "bg-[#F0F5E8] text-[#5A7A3A] border border-[#C8D8B0]",
  REFUNDED:   "bg-[#F5E8E8] text-[#8B4444] border border-[#D8B8B8]",
}

export default async function AdminDashboard() {
  const [orderCount, productCount, pendingCount] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ])

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { fullName: true } },
      items: { select: { id: true } },
    },
  })

  return (
    <div className="space-y-10">
      {/* Page heading */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "#9B9490" }}>
          Overview
        </p>
        <h1 className="font-serif text-3xl font-normal tracking-[0.04em]" style={{ color: "#111111" }}>
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: orderCount },
          { label: "Pending", value: pendingCount },
          { label: "Products", value: productCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DF" }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: "#9B9490" }}>
              {stat.label}
            </p>
            <p className="font-serif text-4xl font-normal" style={{ color: "#111111" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/admin/orders"
          className="p-8 group transition-all duration-200"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DF" }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: "#C9A96E" }}>
            Manage
          </p>
          <h2
            className="font-serif text-2xl font-normal transition-colors duration-200 group-hover:text-[#C9A96E]"
            style={{ color: "#111111" }}
          >
            Orders →
          </h2>
        </Link>
        <Link
          href="/admin/products"
          className="p-8 group transition-all duration-200"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E4DF" }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: "#C9A96E" }}>
            Manage
          </p>
          <h2
            className="font-serif text-2xl font-normal transition-colors duration-200 group-hover:text-[#C9A96E]"
            style={{ color: "#111111" }}
          >
            Products →
          </h2>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="font-serif text-xl font-normal mb-5" style={{ color: "#111111" }}>
          Recent Orders
        </h2>
        <div style={{ border: "1px solid #E8E4DF" }}>
          {recentOrders.map((order, i) => (
            <Link
              key={order.id}
              href={`/admin/orders?id=${order.id}`}
              className="flex items-center justify-between px-6 py-4 transition-colors duration-150 hover:bg-[#FAFAF9]"
              style={{
                borderTop: i > 0 ? "1px solid #E8E4DF" : undefined,
                backgroundColor: "#FFFFFF",
              }}
            >
              <div>
                <p className="text-[12px] font-medium font-mono" style={{ color: "#111111" }}>
                  {order.id.slice(0, 16)}…
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "#6B6560" }}>
                  {order.user.fullName ?? "Guest"} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] ${STATUS_BADGE[order.status] ?? ""}`}>
                  {order.status}
                </span>
                <p className="text-[12px] font-mono" style={{ color: "#111111" }}>
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
