"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "framer-motion"

const categories = [
  {
    name: "HANDBAGS",
    subtitle: "Totes, Crossbody & Clutches",
    href: "/bags",
    image: "/images/hero-bag.jpg",
  },
  {
    name: "JEWELLERY",
    subtitle: "Rings, Bracelets & Necklaces",
    href: "/jewellery",
    image: "/images/editorial-1.jpg",
  },
  {
    name: "SMALL LEATHER GOODS",
    subtitle: "Wallets, Cardholders & Pouches",
    href: "/accessories",
    image: "/images/product-model.jpg",
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
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] } },
}

export function CategoryTypography() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const hoveredCat = categories.find((c) => c.name === hoveredCategory)

  return (
    <section className="py-32 lg:py-40 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center text-[11px] font-sans font-medium tracking-[0.2em] text-text-tertiary uppercase mb-16 lg:mb-20"
        >
          Explore
        </motion.p>

        {/* Category List */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col items-center"
        >
          {categories.map((category, index) => (
            <motion.div key={category.name} variants={item} className="w-full">
              <Link
                href={category.href}
                className="group relative block text-center py-8 lg:py-12"
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Number */}
                <motion.span
                  className="block text-[11px] font-sans tracking-[0.2em] text-text-tertiary group-hover:text-primary transition-colors duration-500 mb-4"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>

                {/* Category Name */}
                <span className="block font-serif font-light text-3xl sm:text-5xl lg:text-6xl xl:text-[72px] text-foreground tracking-[0.12em] leading-none group-hover:text-primary transition-colors duration-500">
                  {category.name}
                </span>

                {/* Subtitle */}
                <span className="block mt-4 text-[12px] font-sans tracking-[0.1em] text-text-tertiary group-hover:text-primary/70 transition-colors duration-500">
                  {category.subtitle}
                </span>

                {/* Gold separator */}
                <span className="block w-8 h-px bg-border mx-auto mt-8 group-hover:bg-primary group-hover:w-16 transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating image preview — desktop only */}
      {!prefersReducedMotion && (
        <AnimatePresence>
          {hoveredCat && (
            <motion.div
              key={hoveredCat.name}
              className="hidden lg:block fixed right-[8vw] top-1/2 -translate-y-1/2 w-[260px] h-[360px] pointer-events-none z-50"
              initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="border border-[#2A2A28] p-px h-full">
                <div className="border border-white/5 h-full relative overflow-hidden">
                  <Image
                    src={hoveredCat.image}
                    alt={hoveredCat.name}
                    fill
                    className="object-cover"
                    sizes="260px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[10px] tracking-[0.2em] text-primary uppercase">
                      {hoveredCat.name}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  )
}
