import type { Metadata } from "next"
import { Header } from "@/components/header"
import { CollectionContent } from "@/components/collection-content"
import { Footer } from "@/components/footer"
import { fetchCategoryPageData } from "@/lib/category-page-helpers"

export const metadata: Metadata = {
  title: "Jewellery | Maison Élise",
  description:
    "Explore our curated selection of fine jewellery. Necklaces, earrings, bracelets, and rings designed with refined elegance.",
  openGraph: {
    title: "Jewellery | MAISON ÉLISE",
    description:
      "Explore our curated selection of fine jewellery. Necklaces, earrings, bracelets, and rings designed with refined elegance.",
  },
}

export const revalidate = 60

export default async function JewelleryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const data = await fetchCategoryPageData("jewellery", params)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CollectionContent
        products={data.products}
        title="Jewellery"
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
