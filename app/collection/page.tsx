import type { Metadata } from "next"
import { Header } from "@/components/header"
import { CollectionContent } from "@/components/collection-content"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Browse our complete collection of luxury leather handbags. Timeless craftsmanship meets contemporary design.',
}

export default function CollectionPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CollectionContent />
      <Footer />
    </main>
  )
}
