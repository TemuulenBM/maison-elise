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

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-elise.com"
  const primaryImage =
    dto.images.find((i) => i.isPrimary)?.url ?? dto.variants[0]?.images[0]?.url

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dto.name,
    description: dto.description ?? `${dto.name} — Luxury leather handbag by Maison Élise`,
    image: primaryImage ? [primaryImage] : [],
    brand: { "@type": "Brand", name: "Maison Élise" },
    url: `${SITE_URL}/product/${dto.slug}`,
    offers: dto.variants.map((v) => ({
      "@type": "Offer",
      price: (v.price / 100).toFixed(2),
      priceCurrency: "USD",
      availability:
        v.available > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/${dto.slug}`,
    })),
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Collection", item: `${SITE_URL}/collection` },
      { "@type": "ListItem", position: 3, name: dto.name },
    ],
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Header />
      <ProductDetail product={product} />
      <RelatedProducts products={relatedProducts} />
      <Footer />
    </main>
  )
}
