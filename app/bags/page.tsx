import type { Metadata } from "next"
import { Header } from "@/components/header"
import { CollectionContent } from "@/components/collection-content"
import { Footer } from "@/components/footer"
import { fetchCategoryPageData } from "@/lib/category-page-helpers"

export const metadata: Metadata = {
  title: "Bags | Maison Élise",
  description:
    "Discover our collection of luxury leather bags. From mini bags to totes, each piece is crafted with exceptional attention to detail.",
}

export const revalidate = 60

export default async function BagsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const data = await fetchCategoryPageData("bags", params)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CollectionContent
        products={data.products}
        title="Bags"
        subcategories={data.subcategories}
        activeCategory={data.category}
        activeSort={data.sort}
        currentPage={data.page}
        totalPages={data.totalPages}
        totalProducts={data.total}
      />
      <Footer />
    </main>
  )
}
