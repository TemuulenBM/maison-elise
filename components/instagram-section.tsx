"use client"

import { ImageWithSkeleton } from "./image-with-skeleton"
import { ArrowRight, Plus } from "lucide-react"
import { motion } from "framer-motion"

import { SITE_IMAGES } from "@/lib/site-images"

const images = [
  { src: SITE_IMAGES.instagram1, alt: "Craftsmanship" },
  { src: SITE_IMAGES.instagram2, alt: "Street style" },
  { src: SITE_IMAGES.instagram3, alt: "Accessories" },
  { src: SITE_IMAGES.instagram4, alt: "Boutique" },
  { src: SITE_IMAGES.editorial1, alt: "Editorial" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } },
}

export function InstagramSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[11px] tracking-[0.2em] text-text-tertiary uppercase mb-4">
            @maison_elise
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-6">
            Follow us on Instagram
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] text-text-tertiary hover:text-primary transition-colors uppercase group"
          >
            Our Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Editorial Asymmetric Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr] grid-rows-2 gap-3 lg:gap-4"
          style={{ gridTemplateRows: "repeat(2, 240px)" }}
        >
          {/* Image 1 — spans 2 rows on desktop */}
          <motion.div
            variants={item}
            className="relative overflow-hidden group cursor-pointer col-span-1 row-span-1 md:row-span-2"
          >
            <ImageWithSkeleton
              src={images[0].src}
              alt={images[0].alt}
              fill
              sizes="(max-width: 768px) 50vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/35 transition-colors duration-500 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center gap-2">
                <Plus className="w-5 h-5 text-foreground" strokeWidth={1} />
                <span className="text-[9px] tracking-[0.25em] text-foreground uppercase">
                  @maison_elise
                </span>
              </div>
            </div>
          </motion.div>

          {/* Images 2–5 — 2×2 grid on right */}
          {images.slice(1).map((image, index) => (
            <motion.div
              key={index}
              variants={item}
              className="relative overflow-hidden group cursor-pointer col-span-1"
            >
              <ImageWithSkeleton
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/35 transition-colors duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center gap-2">
                  <Plus className="w-4 h-4 text-foreground" strokeWidth={1} />
                  <span className="text-[9px] tracking-[0.25em] text-foreground uppercase">
                    @maison_elise
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
