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

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoryTypography />
      <EditorialSection />
      <BrandStory />
      <MagazineSection />
      <BestsellersGrid />
      <InstagramSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
