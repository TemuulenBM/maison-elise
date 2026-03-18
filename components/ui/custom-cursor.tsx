"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
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

    function onMouseLeave() {
      setIsVisible(false)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.documentElement.addEventListener("mouseleave", onMouseLeave)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.documentElement.removeEventListener("mouseleave", onMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      {/* Gold dot */}
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
