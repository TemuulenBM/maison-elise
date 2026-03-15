import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="relative flex flex-col items-center justify-center min-h-[65vh] px-6 text-center overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="relative z-10">
          <p className="text-[80px] lg:text-[120px] font-serif font-light text-primary/20 leading-none mb-2 select-none">
            404
          </p>
          <h1 className="font-serif text-3xl lg:text-4xl text-foreground font-light mb-4">
            Page Not Found
          </h1>
          <p className="text-[13px] text-muted-foreground max-w-md mb-12 leading-relaxed mx-auto">
            The page you are looking for may have been moved, renamed, or no longer exists in our
            collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="text-[11px] tracking-[0.15em] text-primary border border-primary px-8 py-3 hover:bg-primary hover:text-background transition-colors uppercase"
            >
              Return Home
            </Link>
            <Link
              href="/collection"
              className="text-[11px] tracking-[0.15em] text-foreground border border-border px-8 py-3 hover:border-primary hover:text-primary transition-colors uppercase"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
