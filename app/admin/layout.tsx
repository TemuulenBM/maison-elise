import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Admin | Maison Élise",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-surface-2 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-serif text-lg text-foreground font-light tracking-[0.04em]">
              Maison Élise <span className="text-primary">Admin</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/admin/orders"
                className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/admin/products"
                className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors"
              >
                Products
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Storefront
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
