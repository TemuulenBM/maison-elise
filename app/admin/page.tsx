import Link from "next/link"
import { prisma } from "@/lib/prisma"

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
    <div>
      <h1 className="font-serif text-3xl text-foreground font-light tracking-[0.04em] mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Orders", value: orderCount },
          { label: "Pending Orders", value: pendingCount },
          { label: "Products", value: productCount },
        ].map((stat) => (
          <div key={stat.label} className="border border-border p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {stat.label}
            </p>
            <p className="font-serif text-4xl text-foreground font-light">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <Link
          href="/admin/orders"
          className="border border-border p-8 hover:border-primary/50 transition-colors group"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">Manage</p>
          <h2 className="font-serif text-2xl text-foreground font-light group-hover:text-primary transition-colors">
            Orders →
          </h2>
        </Link>
        <Link
          href="/admin/products"
          className="border border-border p-8 hover:border-primary/50 transition-colors group"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-3">Manage</p>
          <h2 className="font-serif text-2xl text-foreground font-light group-hover:text-primary transition-colors">
            Products →
          </h2>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="font-serif text-xl text-foreground font-light mb-6">Recent Orders</h2>
        <div className="border border-border divide-y divide-border">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders?id=${order.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-surface-2 transition-colors"
            >
              <div>
                <p className="text-[12px] text-foreground font-medium">{order.id.slice(0, 16)}...</p>
                <p className="text-[11px] text-muted-foreground">
                  {order.user.fullName ?? "Guest"} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 border border-border text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  {order.status}
                </span>
                <p className="text-[11px] text-foreground mt-1">
                  ${(order.totalAmount / 100).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
