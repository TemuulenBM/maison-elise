import Link from "next/link"
import { ImageWithSkeleton } from "./image-with-skeleton"
import { SITE_IMAGES } from "@/lib/site-images"

const collections = [
  "Cyme",
  "Numéro Neuf",
  "Numéro Dix",
  "Mokki",
  "Neyu",
  "Osmo",
  "Nodde",
  "Numéro Un",
  "Béri",
  "Tonca",
  "Solé",
  "Neiti",
]

const categories = [
  "Winter bags",
  "Belt bags",
  "Handbags",
  "Crossbody",
  "Shoulder bags",
  "Tote bags",
  "Mini bags",
  "Pouch",
]

const inspiration = ["Béri Rizom", "Maison Selection"]

const upcycled = ["Solé", "Béri Rizom"]

export function MegaMenu() {
  return (
    <div className="absolute top-full left-0 right-0 bg-[var(--surface-2)] border-t border-border/50">
      <div className="max-w-[1800px] mx-auto px-8 lg:px-12 py-12">
        <div className="grid grid-cols-5 gap-12">
          {/* Collections */}
          <div>
            <h3 className="text-[11px] tracking-[0.2em] text-muted-foreground mb-6 font-sans font-medium">
              BAGS BY COLLECTION
            </h3>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item}>
                  <Link
                    href={`/collections/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-foreground hover:text-primary transition-colors font-serif"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/collections"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-serif"
                >
                  View all
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[11px] tracking-[0.2em] text-muted-foreground mb-6 font-sans font-medium">
              BAGS BY CATEGORY
            </h3>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item}>
                  <Link
                    href={`/category/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-foreground hover:text-primary transition-colors font-serif"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/bags/new"
                  className="text-sm text-primary hover:text-foreground transition-colors font-serif"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Inspiration */}
          <div>
            <h3 className="text-[11px] tracking-[0.2em] text-muted-foreground mb-6 font-sans font-medium">
              INSPIRATION
            </h3>
            <ul className="space-y-3">
              {inspiration.map((item) => (
                <li key={item}>
                  <Link
                    href={`/inspiration/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-foreground hover:text-primary transition-colors font-serif"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcycled Leather */}
          <div>
            <h3 className="text-[11px] tracking-[0.2em] text-muted-foreground mb-6 font-sans font-medium">
              IN UPCYCLED LEATHER
            </h3>
            <ul className="space-y-3">
              {upcycled.map((item) => (
                <li key={item}>
                  <Link
                    href={`/upcycled/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-foreground hover:text-primary transition-colors font-serif"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <ImageWithSkeleton
              src={SITE_IMAGES.productBrown}
              alt="Featured handbag"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}
