import type { Metadata } from "next"
import { Header } from "@/components/header"
import { CollectionContent } from "@/components/collection-content"
import { Footer } from "@/components/footer"
import { fetchCategoryPageData } from "@/lib/category-page-helpers"

export const metadata: Metadata = {
  title: "Accessories | Maison Élise",
  description:
    "Complete your look with our luxury accessories. Wallets, card holders, keyrings, belts, and small leather goods crafted to perfection.",
  openGraph: {
    title: "Accessories | MAISON ÉLISE",
    description:
      "Complete your look with our luxury accessories. Wallets, card holders, keyrings, belts, and small leather goods crafted to perfection.",
  },
}

export const revalidate = 60

export default async function AccessoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const data = await fetchCategoryPageData("accessories", params)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CollectionContent
        products={data.products}
        title="Accessories"
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
