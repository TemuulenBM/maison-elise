import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { sanityClient } from "@/lib/sanity";
import { ALL_LOOKBOOKS_QUERY } from "@/lib/sanity-queries";
import type { LookbookDoc } from "@/types";

export const revalidate = 3600;

export const metadata = {
  title: "Lookbook | Maison Élise",
  description: "Explore the editorial world of Maison Élise — seasonal lookbooks with shoppable stories.",
};

export default async function LookbookPage() {
  const lookbooks = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    ? await sanityClient.fetch<LookbookDoc[]>(ALL_LOOKBOOKS_QUERY).catch(() => [] as LookbookDoc[])
    : ([] as LookbookDoc[]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page header */}
        <div className="border-b border-white/10 px-6 py-16 text-center">
          <p className="mb-3 font-[var(--font-sans)] text-xs uppercase tracking-[0.3em] text-primary">
            Editorial
          </p>
          <h1 className="font-[Cormorant_Garamond,serif] text-4xl font-light tracking-widest text-foreground md:text-6xl">
            Lookbook
          </h1>
        </div>

        {lookbooks.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="font-[var(--font-sans)] text-sm uppercase tracking-widest text-foreground/40">
              Coming soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {lookbooks.map((lookbook, index) => (
              <Link
                key={lookbook._id}
                href={`/lookbook/${lookbook.slug}`}
                className="group relative block overflow-hidden"
                style={{ aspectRatio: "4/5" }}
              >
                {lookbook.mainImageUrl ? (
                  <Image
                    src={lookbook.mainImageUrl}
                    alt={lookbook.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />
                ) : (
                  <div className="h-full w-full bg-surface-3" />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                {/* Content */}
                <div
                  className="absolute bottom-0 left-0 right-0 translate-y-4 p-8 transition-transform duration-500 group-hover:translate-y-0"
                >
                  {lookbook.season && (
                    <p className="mb-2 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-primary">
                      {lookbook.season}
                    </p>
                  )}
                  <h2 className="font-[Cormorant_Garamond,serif] text-2xl font-light tracking-widest text-foreground md:text-3xl">
                    {lookbook.title}
                  </h2>
                  {lookbook.description && (
                    <p className="mt-2 line-clamp-2 font-[var(--font-sans)] text-xs text-foreground/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {lookbook.description}
                    </p>
                  )}
                  <span className="mt-4 inline-block font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
