import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { AdminProductsTable } from "./products-table"

export const metadata: Metadata = {
  title: "Products | Admin",
  robots: { index: false, follow: false },
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      variants: {
        select: {
          id: true,
          sku: true,
          attributes: true,
          stockQuantity: true,
          reserved: true,
        },
      },
    },
  })

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground font-light tracking-[0.04em] mb-8">
        Products & Inventory
      </h1>
      <AdminProductsTable products={products} />
    </div>
  )
}
