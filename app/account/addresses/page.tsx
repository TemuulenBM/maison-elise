import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AddressBook } from "./address-book"

export const metadata: Metadata = {
  title: "Address Book | Maison Élise",
  robots: { index: false, follow: false },
}

export default async function AddressesPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/account/addresses")
  }

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <AddressBook initialAddresses={addresses} />
        </div>
      </main>
      <Footer />
    </>
  )
}
