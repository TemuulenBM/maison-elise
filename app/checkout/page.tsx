import type { Metadata } from "next"
import { CheckoutForm } from "./checkout-form"

export const metadata: Metadata = {
  title: "Checkout | Maison Élise",
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <CheckoutForm />
}
