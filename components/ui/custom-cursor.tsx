"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Desktop-д л харуулах
    if (window.matchMedia("(pointer: coarse)").matches) return

    let latestX = -100
    let latestY = -100

    function onMouseMove(e: MouseEvent) {
      latestX = e.clientX
      latestY = e.clientY
      if (!isVisible) setIsVisible(true)

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: latestX, y: latestY })
      })
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [data-cursor-hover]")) {
        setIsHovering(true)
      }
    }

    function onMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [data-cursor-hover]")) {
        setIsHovering(false)
      }
    }

    function onMouseLeave() {
      setIsVisible(false)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseout", onMouseOut)
    document.documentElement.addEventListener("mouseleave", onMouseLeave)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseout", onMouseOut)
      document.documentElement.removeEventListener("mouseleave", onMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: position.x - (isHovering ? 20 : 16),
          y: position.y - (isHovering ? 20 : 16),
          width: isHovering ? 40 : 32,
          height: isHovering ? 40 : 32,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.5 }}
        style={{ borderRadius: 0 }}
      >
        <div
          className="w-full h-full border border-white"
          style={{ opacity: 0.6 }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.2 }}
      >
        <div
          className="w-1 h-1 bg-primary"
          style={{ transform: "none" }}
        />
      </motion.div>
    </>
  )
}
