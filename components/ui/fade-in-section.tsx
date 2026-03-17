"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"

interface FadeInSectionProps {
  children: React.ReactNode
  className?: string
  stagger?: boolean
  delay?: number
}

export function FadeInSection({ children, className, stagger, delay = 0 }: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

  const variants = stagger ? staggerContainer : fadeInUp

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </motion.div>
  )
}

// Стagger container-ын child element-д ашиглана
export function FadeInItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  )
}
