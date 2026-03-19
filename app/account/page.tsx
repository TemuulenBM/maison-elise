import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createServerClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { VariantAttributes } from "@/types"

export const metadata: Metadata = {
  title: "My Account | Maison Élise",
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

const VIP_TIER_LABELS: Record<string, { label: string; color: string }> = {
  bronze: { label: "Bronze", color: "text-amber-600" },
  silver: { label: "Silver", color: "text-zinc-400" },
  gold: { label: "Gold", color: "text-primary" },
}

export default async function AccountPage() {
  // Middleware already verifies session with getUser() — use getSession() here to avoid duplicate network call
  const supabase = await createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    redirect("/auth/login?redirect=/account")
  }

  const user = session.user

  const [profile, wishlistItems] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: { select: { name: true, edition: true } },
                  },
                },
              },
            },
          },
        },
        addresses: {
          orderBy: { isDefault: "desc" },
          take: 3,
        },
      },
    }),
    prisma.wishlist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        variant: {
          include: {
            product: { select: { id: true, name: true, slug: true, basePrice: true } },
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
          },
        },
      },
    }),
  ])

  const tier = VIP_TIER_LABELS[profile?.vipTier ?? "bronze"] ?? VIP_TIER_LABELS.bronze

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          {/* Welcome section */}
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              My Account
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground font-light tracking-[0.04em] mb-3">
              {profile?.fullName
                ? `Welcome, ${profile.fullName.split(" ")[0]}`
                : "Welcome"}
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <span className={`text-[11px] uppercase tracking-[0.15em] font-medium ${tier.color}`}>
                {tier.label} Member
              </span>
              <span className="text-border">·</span>
              <span className="text-[11px] text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
            {/* Left — Orders + Wishlist */}
            <div className="space-y-16">
              {/* Recent Orders */}
              <div>
                <div className="flex items-baseline justify-between mb-8">
                  <h2 className="font-serif text-xl text-foreground font-light tracking-[0.04em]">
                    Recent Orders
                  </h2>
                </div>

                {profile?.orders && profile.orders.length > 0 ? (
                  <div className="space-y-6">
                    {profile.orders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/account/orders/${order.id}`}
                        className="block border border-border p-6 hover:border-primary/30 transition-colors duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                              Order
                            </p>
                            <p className="text-[13px] text-foreground font-medium">
                              {order.id.slice(0, 12)}...
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 border border-border text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                              {ORDER_STATUS_LABELS[order.status] ?? order.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-baseline justify-between"
                            >
                              <span className="text-[12px] text-foreground">
                                {item.variant.product.name}
                                {item.variant.product.edition && (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    · {item.variant.product.edition}
                                  </span>
                                )}
                                {item.quantity > 1 && (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    × {item.quantity}
                                  </span>
                                )}
                              </span>
                              <span className="text-[12px] text-foreground">
                                $
                                {(
                                  (item.priceAtPurchase * item.quantity) /
                                  100
                                ).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-baseline justify-between pt-4 border-t border-border">
                          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                            Total
                          </span>
                          <span className="font-serif text-lg text-foreground font-light">
                            ${(order.totalAmount / 100).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-[10px] text-muted-foreground mt-3">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="border border-border p-12 text-center">
                    <p className="text-[13px] text-muted-foreground mb-6">
                      You haven&apos;t placed any orders yet.
                    </p>
                    <Link
                      href="/collection"
                      className="inline-block px-8 py-3 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-colors duration-300"
                    >
                      Explore Collection
                    </Link>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <div>
                <div className="flex items-baseline justify-between mb-8">
                  <h2 className="font-serif text-xl text-foreground font-light tracking-[0.04em]">
                    Wishlist
                  </h2>
                  {wishlistItems.length > 0 && (
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {wishlistItems.length} {wishlistItems.length === 1 ? "piece" : "pieces"}
                    </span>
                  )}
                </div>

                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => {
                      const attrs = item.variant.attributes as unknown as VariantAttributes
                      const image = item.variant.images[0]
                      const price = item.variant.product.basePrice
                      return (
                        <Link
                          key={item.id}
                          href={`/product/${item.variant.product.slug}`}
                          className="group block"
                        >
                          <div className="aspect-[3/4] bg-surface-2 overflow-hidden mb-3">
                            {image ? (
                              <Image
                                src={image.url}
                                alt={image.altText ?? item.variant.product.name}
                                width={300}
                                height={400}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full bg-surface-3" />
                            )}
                          </div>
                          <p className="text-[12px] text-foreground tracking-[0.03em] mb-1">
                            {item.variant.product.name}
                          </p>
                          {attrs?.color && (
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-1">
                              {attrs.color}
                            </p>
                          )}
                          <p className="text-[12px] text-foreground">
                            ${(price / 100).toLocaleString()}
                          </p>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="border border-border p-12 text-center">
                    <p className="text-[13px] text-muted-foreground mb-6">
                      Your wishlist is empty.
                    </p>
                    <Link
                      href="/collection"
                      className="inline-block px-8 py-3 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-colors duration-300"
                    >
                      Discover Pieces
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar — Profile & Addresses */}
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="border border-border p-6">
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-4">
                  Profile
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">
                      Name
                    </p>
                    <p className="text-[13px] text-foreground">
                      {profile?.fullName ?? "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">
                      Email
                    </p>
                    <p className="text-[13px] text-foreground">{user.email}</p>
                  </div>
                  {profile?.phone && (
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        Phone
                      </p>
                      <p className="text-[13px] text-foreground">
                        {profile.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="border border-border p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                    Addresses
                  </h3>
                  <Link
                    href="/account/addresses"
                    className="text-[10px] text-primary uppercase tracking-[0.1em] hover:opacity-70 transition-opacity"
                  >
                    Manage
                  </Link>
                </div>
                {profile?.addresses && profile.addresses.length > 0 ? (
                  <div className="space-y-4">
                    {profile.addresses.map((addr) => (
                      <div key={addr.id} className="text-[12px] text-foreground leading-relaxed">
                        {addr.label && (
                          <p className="text-[10px] text-primary uppercase tracking-[0.1em] mb-1">
                            {addr.label}
                            {addr.isDefault && " · Default"}
                          </p>
                        )}
                        <p>{addr.fullName}</p>
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>
                          {addr.city}
                          {addr.state && `, ${addr.state}`} {addr.postalCode}
                        </p>
                        <p>{addr.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Link
                    href="/account/addresses"
                    className="block text-[12px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    Add your first address →
                  </Link>
                )}
              </div>

              {/* Quick Links */}
              <div className="border border-border p-6">
                <h3 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/collection"
                    className="block text-[12px] text-foreground hover:text-primary transition-colors"
                  >
                    Browse Collection
                  </Link>
                  <Link
                    href="/concierge"
                    className="block text-[12px] text-foreground hover:text-primary transition-colors"
                  >
                    Contact Concierge
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
