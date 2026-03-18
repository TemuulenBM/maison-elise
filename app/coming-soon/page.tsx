import Link from "next/link"
import { Header } from "@/components/header"

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-[11px] tracking-[0.3em] text-primary uppercase mb-6">
          Coming Soon
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-foreground font-light mb-4">
          Currently in Preparation
        </h1>
        <div className="w-12 h-px bg-primary my-6" />
        <p className="text-[13px] text-muted-foreground max-w-sm mb-10 leading-relaxed">
          This section is being carefully prepared. In the meantime, our team is at your disposal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="border border-primary text-primary px-8 py-3 text-[11px] uppercase tracking-[0.15em] hover:bg-primary hover:text-background transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/concierge"
            className="border border-border text-muted-foreground px-8 py-3 text-[11px] uppercase tracking-[0.15em] hover:border-primary hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}
