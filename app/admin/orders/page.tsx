import { prisma } from "@/lib/prisma"
import { AdminOrdersTable } from "./orders-table"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { fullName: true } },
      items: { select: { id: true, quantity: true } },
    },
  })

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground font-light tracking-[0.04em] mb-8">
        Orders
      </h1>
      <AdminOrdersTable orders={orders} />
    </div>
  )
}
