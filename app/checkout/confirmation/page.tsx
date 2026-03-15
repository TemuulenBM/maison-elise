import type { Metadata } from "next"
import { Suspense } from "react"
import { ConfirmationContent } from "./confirmation-content"

export const metadata: Metadata = {
  title: "Order Confirmed | Maison Élise",
  robots: { index: false, follow: false },
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  )
}
