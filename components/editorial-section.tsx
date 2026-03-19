"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ImageWithSkeleton } from "./image-with-skeleton"
import { motion } from "framer-motion"
import { SITE_IMAGES } from "@/lib/site-images"

export function EditorialSection() {
  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Image */}
        <motion.div
          className="relative h-[60vh] lg:h-[80vh] overflow-hidden group"
          initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ImageWithSkeleton
              src={SITE_IMAGES.editorial1}
              alt="Fashion editorial"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />

          {/* Hover overlay text */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-8">
            <p className="text-[10px] tracking-[0.25em] text-primary uppercase mb-2">Spring 2026</p>
            <p className="font-serif font-light text-xl text-foreground">Editorial</p>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="relative h-[60vh] lg:h-[80vh] overflow-hidden group"
          initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ImageWithSkeleton
              src={SITE_IMAGES.editorial2}
              alt="Fashion editorial"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />

          {/* Hover overlay text */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-8">
            <p className="text-[10px] tracking-[0.25em] text-primary uppercase mb-2">The Edit</p>
            <p className="font-serif font-light text-xl text-foreground">Campaign 2026</p>
          </div>
        </motion.div>
      </div>

      {/* Lookbook CTA */}
      <motion.div
        className="flex justify-center py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
      >
        <Link
          href="/lookbook"
          className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.3em] text-primary hover:opacity-80 transition-opacity group"
        >
          Explore Lookbook
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  )
}
