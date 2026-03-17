import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ConciergeForm } from "./concierge-form"

export const metadata: Metadata = {
  title: "Concierge | Maison Élise",
  description:
    "Our dedicated concierge team is available to assist with personalized styling, bespoke requests, and exclusive services.",
}

export default function ConciergePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-20 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Exclusive Service
            </p>
            <h1 className="font-serif text-5xl lg:text-6xl text-foreground font-light tracking-[0.03em] mb-6">
              Concierge
            </h1>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              From personalized styling consultations to bespoke commissions, our team is
              here to ensure your Maison Élise experience is extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
            {/* Contact Form */}
            <ConciergeForm />

            {/* Contact Info Sidebar */}
            <div className="space-y-8">
              {/* Direct Contact */}
              <div className="border border-border p-8">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-6">
                  Direct Contact
                </h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-primary mb-2">
                      Email
                    </p>
                    <a
                      href="mailto:concierge@maison-elise.com"
                      className="text-[13px] text-foreground hover:text-primary transition-colors"
                    >
                      concierge@maison-elise.com
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-primary mb-2">
                      WhatsApp
                    </p>
                    <a
                      href="https://wa.me/97699000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-foreground hover:text-primary transition-colors"
                    >
                      +976 99 000 000
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2">
                      Response Time
                    </p>
                    <p className="text-[13px] text-foreground">
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="border border-border p-8">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-6">
                  Our Services
                </h3>
                <ul className="space-y-3">
                  {[
                    "Personal styling consultation",
                    "Bespoke & custom orders",
                    "Gift curation & wrapping",
                    "Monogramming & personalization",
                    "Repair & restoration",
                    "VIP preview access",
                  ].map((service) => (
                    <li key={service} className="flex items-center gap-3">
                      <span className="w-1 h-1 bg-primary flex-shrink-0" />
                      <span className="text-[13px] text-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Boutique */}
              <div className="border border-border p-8">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-4">
                  Visit Us
                </h3>
                <p className="text-[13px] text-foreground leading-relaxed mb-1">
                  Maison Élise Boutique
                </p>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Ulaanbaatar, Mongolia<br />
                  Mon – Sat · 10:00 – 19:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
