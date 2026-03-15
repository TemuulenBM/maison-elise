import type { Metadata } from "next"
import { Header } from "@/components/header"
import { CollectionContent } from "@/components/collection-content"
import { Footer } from "@/components/footer"
import { getProducts } from "@/lib/products"
import { toDisplayProduct } from "@/lib/adapters"

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Browse our complete collection of luxury leather handbags. Timeless craftsmanship meets contemporary design.',
}

export const revalidate = 60

export default async function CollectionPage() {
  const { products: dtos } = await getProducts({
    page: 1,
    limit: 20,
    sort: "newest",
  })
  const products = dtos.map(toDisplayProduct)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CollectionContent products={products} />
      <Footer />
    </main>
  )
}
