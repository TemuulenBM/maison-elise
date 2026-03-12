import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { ProductDetail } from "@/components/product-detail"
import { Footer } from "@/components/footer"
import { products } from "@/data/products"

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = products.find((p) => p.id === id)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} - ${product.edition}`,
    description: product.description || `Discover the ${product.name} ${product.edition}. Luxury leather handbag by MAISON ÉLISE.`,
    openGraph: {
      title: `${product.name} - ${product.edition} | MAISON ÉLISE`,
      description: product.description || `Discover the ${product.name} ${product.edition}.`,
      images: [{ url: product.image }],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </main>
  )
}
