"use client"

import { motion } from "framer-motion"
import { ImageWithSkeleton } from "./image-with-skeleton"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SITE_IMAGES } from "@/lib/site-images"

const EASE_LUXURY = [0.25, 0.1, 0.25, 1] as const

export function MagazineSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Magazine Image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <ImageWithSkeleton
                src={SITE_IMAGES.editorialAtelier}
                alt="Maison Élise Atelier"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: EASE_LUXURY, delay: 0.15 }}
          >
            <div className="border-l border-primary/30 pl-6">
              <p className="text-[11px] tracking-[0.2em] text-text-tertiary uppercase mb-6">
                L&apos;ATELIER MAISON ÉLISE
              </p>

              <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-6 leading-tight">
                Made by hand. Worn for a lifetime.
              </h2>

              <p className="text-[15px] text-text-tertiary leading-relaxed mb-8 font-sans">
                Every Maison Élise piece begins with a single length of full-grain leather and the
                unhurried attention of a master artisan. No shortcuts. No compromise. Only objects
                that grow more beautiful with each passing year.
              </p>

              <Link
                href="/collection"
                className="inline-flex items-center gap-3 text-[11px] tracking-[0.15em] text-foreground uppercase hover:text-primary transition-colors group"
              >
                Discover the Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
