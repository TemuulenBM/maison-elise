"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Clock, Phone, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SITE_IMAGES } from "@/lib/site-images"

const boutiques = [
  {
    city: "Paris",
    country: "France",
    label: "Flagship",
    address: "24 Rue du Faubourg Saint-Honoré, 75008 Paris",
    hours: "Mon–Sat 10:00–19:00 · Sun 12:00–18:00",
    phone: "+33 1 42 56 78 90",
    image: SITE_IMAGES.editorial1,
  },
  {
    city: "Monaco",
    country: "Principauté de Monaco",
    label: null,
    address: "12 Avenue de Monte-Carlo, 98000 Monaco",
    hours: "Mon–Sat 10:00–19:00",
    phone: "+377 93 25 41 60",
    image: SITE_IMAGES.editorial2,
  },
  {
    city: "London",
    country: "United Kingdom",
    label: null,
    address: "15 New Bond Street, London W1S 2RE",
    hours: "Mon–Sat 10:00–18:30",
    phone: "+44 20 7629 1234",
    image: SITE_IMAGES.editorialMagazine,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export default function StoresPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24 lg:pb-32 px-6 lg:px-12">
        {/* Hero */}
        <motion.div
          className="text-center mb-20 lg:mb-28"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[11px] tracking-[0.3em] text-primary uppercase mb-6">
            Boutiques
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl text-foreground font-light mb-6">
            Visit Our Houses
          </h1>
          <div className="w-12 h-px bg-primary mx-auto mb-6" />
          <p className="text-[14px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            Each boutique is a sanctuary of craft and discretion. Our advisors are available to
            guide you through each collection and arrange a private appointment.
          </p>
        </motion.div>

        {/* Boutique Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto"
        >
          {boutiques.map((boutique) => (
            <motion.div key={boutique.city} variants={item} className="group">
              {/* Image */}
              <div className="border border-[#2A2A28] p-px mb-6">
                <div className="border border-white/5 relative aspect-[4/3] overflow-hidden bg-card">
                  <Image
                    src={boutique.image}
                    alt={`Maison Élise ${boutique.city}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {boutique.label && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-background text-[10px] tracking-[0.15em] uppercase">
                      {boutique.label}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-primary uppercase mb-1">
                    {boutique.country}
                  </p>
                  <h2 className="font-serif text-2xl text-foreground">{boutique.city}</h2>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      {boutique.address}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-[12px] text-muted-foreground">{boutique.hours}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <a
                      href={`tel:${boutique.phone.replace(/\s/g, "")}`}
                      className="text-[12px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      {boutique.phone}
                    </a>
                  </div>
                </div>

                <Link
                  href="/concierge"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] text-foreground uppercase hover:text-primary transition-colors group/link"
                >
                  Book a Visit
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-24 lg:mt-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-px h-16 bg-border mx-auto mb-8" />
          <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase mb-4">
            Prefer to write?
          </p>
          <Link
            href="/concierge"
            className="font-serif text-xl text-foreground hover:text-primary transition-colors"
          >
            Contact our concierge →
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
