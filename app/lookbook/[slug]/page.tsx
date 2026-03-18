import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductHotspot } from "@/components/editorial/ProductHotspot";
import { sanityClient } from "@/lib/sanity";
import { LOOKBOOK_BY_SLUG_QUERY } from "@/lib/sanity-queries";
import { prisma } from "@/lib/prisma";
import type { LookbookDoc, EditorialPageData, EditorialHotspotData } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return {};
  const editorial = await sanityClient
    .fetch<LookbookDoc | null>(LOOKBOOK_BY_SLUG_QUERY, { slug })
    .catch(() => null);

  if (!editorial) return {};
  return {
    title: `${editorial.title} | Lookbook | Maison Élise`,
    description: editorial.description ?? undefined,
    openGraph: editorial.mainImageUrl
      ? { images: [{ url: editorial.mainImageUrl }] }
      : undefined,
  };
}

export default async function LookbookDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [editorial, hotspots] = await Promise.all([
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      ? sanityClient
          .fetch<LookbookDoc | null>(LOOKBOOK_BY_SLUG_QUERY, { slug })
          .catch(() => null as LookbookDoc | null)
      : Promise.resolve(null as LookbookDoc | null),
    prisma.editorialHotspot.findMany({ where: { editorialSlug: slug } }),
  ]);

  if (!editorial) notFound();

  // Hotspot-уудын бүтээгдэхүүнийг нэг хүсэлтээр авна
  const productIds = [...new Set(hotspots.map((h) => h.productId))];
  const products =
    productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            slug: true,
            name: true,
            basePrice: true,
            variants: {
              take: 1,
              select: {
                images: {
                  orderBy: { sortOrder: "asc" },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        })
      : [];

  const productMap = new Map(products.map((p) => [p.id, p]));

  const editorialHotspots: EditorialHotspotData[] = hotspots
    .map((h) => {
      const product = productMap.get(h.productId);
      if (!product) return null;
      return {
        id: h.id,
        positionX: Number(h.positionX),
        positionY: Number(h.positionY),
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.basePrice / 100,
          imageUrl: product.variants[0]?.images[0]?.url ?? "",
        },
      };
    })
    .filter((h): h is EditorialHotspotData => h !== null);

  const data: EditorialPageData = { ...editorial, hotspots: editorialHotspots };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Back link */}
        <div className="px-6 py-6">
          <Link
            href="/lookbook"
            className="font-[var(--font-sans)] text-[10px] uppercase tracking-[0.25em] text-foreground/40 transition-colors hover:text-[#C9A96E]"
          >
            ← Lookbook
          </Link>
        </div>

        {/* Hero editorial image with hotspots */}
        <div className="relative mx-auto max-w-5xl px-0 md:px-6">
          <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
            {data.mainImageUrl ? (
              <Image
                src={data.mainImageUrl}
                alt={data.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 960px"
                priority
              />
            ) : (
              <div className="h-full w-full bg-[#1A1A1A]" />
            )}

            {/* Interactive hotspot pins */}
            {data.hotspots.map((hotspot) => (
              <ProductHotspot key={hotspot.id} hotspot={hotspot} />
            ))}
          </div>
        </div>

        {/* Editorial info */}
        <div className="mx-auto max-w-2xl px-6 py-12 text-center">
          {data.season && (
            <p className="mb-3 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-[#C9A96E]">
              {data.season}
            </p>
          )}
          <h1 className="font-[Cormorant_Garamond,serif] text-4xl font-light tracking-widest text-foreground md:text-5xl">
            {data.title}
          </h1>
          {data.description && (
            <p className="mt-6 font-[var(--font-sans)] text-sm leading-relaxed text-foreground/60">
              {data.description}
            </p>
          )}
        </div>

        {/* Mobile: product list below image */}
        {data.hotspots.length > 0 && (
          <div className="border-t border-white/10 px-6 py-10 md:hidden">
            <p className="mb-6 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              Featured in this story
            </p>
            <div className="grid grid-cols-2 gap-4">
              {data.hotspots.map((hotspot) => (
                <Link
                  key={hotspot.id}
                  href={`/product/${hotspot.product.slug}`}
                  className="group border border-white/10 p-3 transition-colors hover:border-[#C9A96E]/40"
                >
                  {hotspot.product.imageUrl && (
                    <div className="relative mb-3 aspect-square overflow-hidden">
                      <Image
                        src={hotspot.product.imageUrl}
                        alt={hotspot.product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="150px"
                      />
                    </div>
                  )}
                  <p className="truncate font-[var(--font-sans)] text-[10px] uppercase tracking-widest text-foreground">
                    {hotspot.product.name}
                  </p>
                  <p className="mt-1 font-[var(--font-sans)] text-xs text-[#C9A96E]">
                    ${hotspot.product.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
