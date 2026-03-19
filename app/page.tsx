import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoryTypography } from "@/components/category-typography"
import { EditorialSection } from "@/components/editorial-section"
import { BrandStory } from "@/components/brand-story"
import { MagazineSection } from "@/components/magazine-section"
import { BestsellersGrid } from "@/components/bestsellers-grid"
import { InstagramSection } from "@/components/instagram-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { getProducts } from "@/lib/products"
import { toDisplayProduct } from "@/lib/adapters"

export const revalidate = 60

export const metadata: Metadata = {
  title: "MAISON ÉLISE — Luxury Handbags & Accessories",
  description:
    "Discover Maison Élise — handcrafted luxury handbags, jewellery and accessories. Timeless elegance, exceptional craftsmanship.",
  openGraph: {
    title: "MAISON ÉLISE — Luxury Handbags & Accessories",
    description:
      "Discover Maison Élise — handcrafted luxury handbags, jewellery and accessories. Timeless elegance, exceptional craftsmanship.",
    url: "https://maisonelise.com",
    images: [
      {
        url: "https://qtvmfbicoibfdbhaksoz.supabase.co/storage/v1/object/public/products/hero-model.jpg",
        width: 1200,
        height: 630,
        alt: "Maison Élise — Luxury Handbags",
      },
    ],
  },
}

export default async function Home() {
  const { products: dtos } = await getProducts({
    page: 1,
    limit: 6,
    sort: "newest",
  })
  const products = dtos.map(toDisplayProduct)

  return (
    <main className="min-h-dvh bg-background">
      <Header />
      <HeroSection />
      <CategoryTypography />
      <EditorialSection />
      <BrandStory />
      <MagazineSection />
      <BestsellersGrid products={products} />
      <InstagramSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
