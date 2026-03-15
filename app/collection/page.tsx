import type { Metadata } from "next"
import { Header } from "@/components/header"
import { CollectionContent } from "@/components/collection-content"
import { Footer } from "@/components/footer"
import { getProducts } from "@/lib/products"
import { toDisplayProduct } from "@/lib/adapters"

export const metadata: Metadata = {
  title: "Collection | Maison Élise",
  description:
    "Browse our complete collection of luxury leather handbags. Timeless craftsmanship meets contemporary design.",
}

export const revalidate = 60

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const sort = (typeof params.sort === "string" ? params.sort : "newest") as
    | "newest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
  const category = typeof params.category === "string" ? params.category : undefined
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1

  const {
    products: dtos,
    total,
    totalPages,
  } = await getProducts({
    category,
    sort,
    page,
    limit: 20,
  })
  const products = dtos.map(toDisplayProduct)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CollectionContent
        products={products}
        title="Collection"
        activeCategory={category}
        activeSort={sort}
        currentPage={page}
        totalPages={totalPages}
        totalProducts={total}
      />
      <Footer />
    </main>
  )
}
