"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

export function ImageWithSkeleton({ className, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-[var(--surface-2)] animate-pulse" />
      )}
      <Image
        alt={alt ?? ""}
        {...props}
        className={cn(
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
      />
    </>
  )
}
