import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Size Guide | Maison Élise",
  description:
    "Find your perfect fit with our comprehensive size guide for handbags, straps, and accessories.",
  openGraph: {
    title: "Size Guide | MAISON ÉLISE",
    description:
      "Find your perfect fit with our comprehensive size guide for handbags, straps, and accessories.",
  },
}

const BAG_DIMENSIONS = [
  {
    name: "The Élise",
    edition: "Signature",
    width: "28 cm",
    height: "20 cm",
    depth: "10 cm",
    strapDrop: "50 cm",
    notes: "Fits A5 notebook, phone, wallet, keys",
  },
  {
    name: "The Élise Mini",
    edition: "Compact",
    width: "20 cm",
    height: "15 cm",
    depth: "7 cm",
    strapDrop: "45 cm",
    notes: "Evening bag, essentials only",
  },
  {
    name: "The Élise Tote",
    edition: "Oversized",
    width: "38 cm",
    height: "32 cm",
    depth: "14 cm",
    strapDrop: "28 cm (handles)",
    notes: "Fits A4 documents, laptop up to 13\"",
  },
  {
    name: "The Ceinture",
    edition: "Belt Bag",
    width: "22 cm",
    height: "14 cm",
    depth: "6 cm",
    strapDrop: "Adjustable 70–110 cm",
    notes: "Worn crossbody or at the waist",
  },
]

const CHAIN_LENGTHS = [
  { style: "Short chain", length: "50 cm drop", notes: "Shoulder carry" },
  { style: "Long chain", length: "65 cm drop", notes: "Crossbody carry" },
  { style: "Leather strap", length: "Adjustable 45–65 cm", notes: "Shoulder or crossbody" },
  { style: "Top handles", length: "28 cm drop", notes: "Hand or crook of arm" },
]

export default function SizeGuidePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Reference Guide
            </p>
            <h1 className="font-serif text-5xl lg:text-6xl text-foreground font-light tracking-[0.03em] mb-6">
              Size Guide
            </h1>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl">
              Each Maison Élise piece is crafted to carry what matters. Use this guide to find
              your perfect companion for every occasion.
            </p>
          </div>

          {/* Bag Dimensions Table */}
          <section className="mb-20">
            <h2 className="font-serif text-2xl text-foreground font-light tracking-[0.04em] mb-8">
              Bag Dimensions
            </h2>
            <div className="border border-border overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_2fr_2fr] gap-0 border-b border-border bg-surface-2">
                {["Bag", "W", "H", "D", "Strap Drop", "Capacity"].map((h) => (
                  <div
                    key={h}
                    className="px-4 py-3 text-[9px] uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    {h}
                  </div>
                ))}
              </div>
              {/* Table Rows */}
              {BAG_DIMENSIONS.map((bag, i) => (
                <div
                  key={bag.name}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_2fr_2fr] gap-0 ${i < BAG_DIMENSIONS.length - 1 ? "border-b border-border" : ""} hover:bg-surface-2 transition-colors duration-200`}
                >
                  <div className="px-4 py-4">
                    <p className="text-[13px] text-foreground">{bag.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.08em] mt-0.5">
                      {bag.edition}
                    </p>
                  </div>
                  <div className="px-4 py-4 text-[12px] text-foreground flex items-center">
                    {bag.width}
                  </div>
                  <div className="px-4 py-4 text-[12px] text-foreground flex items-center">
                    {bag.height}
                  </div>
                  <div className="px-4 py-4 text-[12px] text-foreground flex items-center">
                    {bag.depth}
                  </div>
                  <div className="px-4 py-4 text-[12px] text-foreground flex items-center">
                    {bag.strapDrop}
                  </div>
                  <div className="px-4 py-4 text-[12px] text-muted-foreground flex items-center">
                    {bag.notes}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Strap & Chain Lengths */}
          <section className="mb-20">
            <h2 className="font-serif text-2xl text-foreground font-light tracking-[0.04em] mb-8">
              Strap & Chain Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHAIN_LENGTHS.map((item) => (
                <div key={item.style} className="border border-[#2A2A28] p-px">
                <div className="border border-white/5 bg-surface-2 p-6">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-primary mb-2">
                    {item.style}
                  </p>
                  <p className="font-serif text-xl text-foreground font-light mb-2">
                    {item.length}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{item.notes}</p>
                </div>
                </div>
              ))}
            </div>
          </section>

          {/* Material Care Note */}
          <section className="border border-[#2A2A28] p-px mb-16">
          <div className="border border-white/5 bg-surface-2 p-8">
            <h2 className="font-serif text-xl text-foreground font-light tracking-[0.04em] mb-4">
              Material & Care
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[13px] text-muted-foreground leading-relaxed">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-foreground mb-3">
                  Full-Grain Leather
                </p>
                <p>
                  Develops a rich patina over time. Clean with a soft, dry cloth. Condition
                  every 3–6 months with a leather conditioner. Keep away from prolonged
                  sunlight and moisture.
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-foreground mb-3">
                  Hardware
                </p>
                <p>
                  Solid brass with antique or polished finish. Polish lightly with a dry cloth.
                  Avoid contact with perfume and chemicals. Hardware may develop a subtle patina
                  — a sign of authenticity.
                </p>
              </div>
            </div>
          </div>
          </section>

          {/* Need help */}
          <div className="text-center">
            <p className="text-[13px] text-muted-foreground mb-6">
              Still unsure? Our concierge team can guide you to the perfect piece.
            </p>
            <a
              href="/concierge"
              className="inline-block px-10 py-3.5 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-colors duration-300"
            >
              Contact Concierge
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
