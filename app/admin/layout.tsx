import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Admin | Maison Élise",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF9" }}>
      {/* Admin Header */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E8E4DF" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/admin" className="font-serif text-lg font-normal tracking-[0.04em]" style={{ color: "#111111" }}>
              Maison Élise{" "}
              <span style={{ color: "#C9A96E" }}>Admin</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/admin/orders"
                className="text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 text-[#6B6560] hover:text-[var(--primary)]"
              >
                Orders
              </Link>
              <Link
                href="/admin/products"
                className="text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 text-[#6B6560] hover:text-[var(--primary)]"
              >
                Products
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.12em] transition-colors duration-200"
            style={{ color: "#9B9490" }}
          >
            ← Storefront
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 md:px-6 md:py-12">
        {children}
      </main>
    </div>
  )
}
