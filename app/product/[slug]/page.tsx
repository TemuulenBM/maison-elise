import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { ProductDetail } from "@/components/product-detail"
import { Footer } from "@/components/footer"
import { RelatedProducts } from "@/components/related-products"
import { getProductBySlug, getProducts } from "@/lib/products"
import { toDisplayProduct } from "@/lib/adapters"

export const revalidate = 60

export async function generateStaticParams() {
  const { products } = await getProducts({ page: 1, limit: 100, sort: "newest" })
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const dto = await getProductBySlug(slug)
  if (!dto) return { title: "Product Not Found" }

  const image = dto.images.find((i) => i.isPrimary)?.url ?? dto.variants[0]?.images[0]?.url
  return {
    title: `${dto.name} - ${dto.edition ?? ""}`,
    description:
      dto.description ??
      `Discover the ${dto.name} ${dto.edition ?? ""}. Luxury leather handbag by MAISON ÉLISE.`,
    openGraph: {
      title: `${dto.name} - ${dto.edition ?? ""} | MAISON ÉLISE`,
      description: dto.description ?? `Discover the ${dto.name} ${dto.edition ?? ""}.`,
      images: image ? [{ url: image }] : [],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dto = await getProductBySlug(slug)

  if (!dto) {
    notFound()
  }

  const product = toDisplayProduct(dto)

  // Related products (exclude current)
  const { products: allDtos } = await getProducts({ page: 1, limit: 5, sort: "newest" })
  const relatedProducts = allDtos
    .filter((p) => p.slug !== slug)
    .map(toDisplayProduct)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ProductDetail product={product} />
      <RelatedProducts products={relatedProducts} />
      <Footer />
    </main>
  )
}
