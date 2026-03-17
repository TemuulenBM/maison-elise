import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createServerClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { VariantAttributes } from "@/types"

export const metadata: Metadata = {
  title: "Order Details | Maison Élise",
  robots: { index: false, follow: false },
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  REFUNDED: "Refunded",
}

type ShippingAddress = {
  fullName?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  phone?: string
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/account")
  }

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: { select: { name: true, slug: true, edition: true } },
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
            },
          },
        },
      },
    },
  })

  if (!order || order.userId !== user.id) {
    notFound()
  }

  const shipping = order.shippingAddress as ShippingAddress

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-12 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="/account" className="hover:text-primary transition-colors">
              Account
            </Link>
            <span>/</span>
            <span className="text-foreground">Order</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Order Details
            </p>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-serif text-3xl text-foreground font-light tracking-[0.04em]">
                  {order.id.slice(0, 16)}
                </h1>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="inline-block px-4 py-2 border border-border text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border border-border mb-8">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Items
              </h2>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => {
                const attrs = item.variant.attributes as unknown as VariantAttributes
                const image = item.variant.images[0]
                return (
                  <div key={item.id} className="flex gap-4 p-6">
                    <div className="w-16 h-20 bg-surface-2 flex-shrink-0 overflow-hidden">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.altText ?? item.variant.product.name}
                          width={64}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.variant.product.slug}`}
                        className="text-[13px] text-foreground hover:text-primary transition-colors"
                      >
                        {item.variant.product.name}
                        {item.variant.product.edition && (
                          <span className="text-muted-foreground">
                            {" "}· {item.variant.product.edition}
                          </span>
                        )}
                      </Link>
                      {attrs?.color && (
                        <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground mt-1">
                          {attrs.color}
                        </p>
                      )}
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Qty: {item.quantity}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[13px] text-foreground">
                        ${((item.priceAtPurchase * item.quantity) / 100).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          ${(item.priceAtPurchase / 100).toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="px-6 py-4 border-t border-border flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Order Total
              </span>
              <span className="font-serif text-xl text-foreground font-light">
                ${(order.totalAmount / 100).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          {shipping && (
            <div className="border border-border p-6 mb-8">
              <h2 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-4">
                Shipping Address
              </h2>
              <div className="text-[13px] text-foreground leading-relaxed">
                {shipping.fullName && <p>{shipping.fullName}</p>}
                {shipping.line1 && <p>{shipping.line1}</p>}
                {shipping.line2 && <p>{shipping.line2}</p>}
                {(shipping.city || shipping.state || shipping.postalCode) && (
                  <p>
                    {shipping.city}
                    {shipping.state && `, ${shipping.state}`}
                    {shipping.postalCode && ` ${shipping.postalCode}`}
                  </p>
                )}
                {shipping.country && <p>{shipping.country}</p>}
                {shipping.phone && (
                  <p className="text-muted-foreground mt-2">{shipping.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Gift Options */}
          {order.giftPackaging && (
            <div className="border border-border p-6 mb-8">
              <h2 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-3">
                Gift Packaging
              </h2>
              <p className="text-[12px] text-primary uppercase tracking-[0.1em] mb-2">
                Signature gift wrap included
              </p>
              {order.giftNote && (
                <p className="text-[13px] text-foreground italic">
                  &ldquo;{order.giftNote}&rdquo;
                </p>
              )}
            </div>
          )}

          <Link
            href="/account"
            className="inline-block text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Account
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
