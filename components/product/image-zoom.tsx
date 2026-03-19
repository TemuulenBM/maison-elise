"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ZoomIn } from "lucide-react"

interface ImageZoomProps {
  src: string
  alt: string
}

export function ImageZoom({ src, alt }: ImageZoomProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setCursor({ x, y })
  }

  return (
    <>
      {/* Zoomable image container */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsFullscreen(true)}
      >
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={isHovered
            ? { scale: 1.03, opacity: 1, filter: "blur(0px)" }
            : { scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
          />
        </motion.div>

        {/* Zoom hint */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm">
            <ZoomIn className="w-3 h-3 text-foreground" />
            <span className="text-[10px] uppercase tracking-[0.1em] text-foreground">Expand</span>
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              type="button"
              className="absolute top-6 right-6 p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-3xl max-h-[90vh] aspect-[3/4] mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                style={{
                  transformOrigin: `${cursor.x}% ${cursor.y}%`,
                }}
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </motion.div>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Click anywhere to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
