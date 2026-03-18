"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { EditorialHotspotData } from "@/types";

interface ProductHotspotProps {
  hotspot: EditorialHotspotData;
}

export function ProductHotspot({ hotspot }: ProductHotspotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Гаднаас дарвал хаа
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Popup-г зөв талд байрлуулах (дэлгэцийн хагасаас хамааран)
  const popupLeft = hotspot.positionX > 60 ? "right-8" : "left-8";
  const popupTop = hotspot.positionY > 60 ? "bottom-8" : "top-8";

  return (
    <div
      ref={ref}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${hotspot.positionX}%`,
        top: `${hotspot.positionY}%`,
        zIndex: isOpen ? 20 : 10,
      }}
    >
      {/* Пульсирлах алтан цэг */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`View ${hotspot.product.name}`}
        className="relative flex h-8 w-8 items-center justify-center"
      >
        {/* Пульс анимаци */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A96E] opacity-40" />
        <span className="relative flex h-4 w-4 rounded-full border-2 border-[#C9A96E] bg-background" />
      </button>

      {/* Бүтээгдэхүүний card popup */}
      {isOpen && (
        <div
          className={`absolute ${popupTop} ${popupLeft} w-56 border border-white/10 bg-[#1A1A1A] p-3 shadow-2xl`}
        >
          <div className="flex gap-3">
            {hotspot.product.imageUrl && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                <Image
                  src={hotspot.product.imageUrl}
                  alt={hotspot.product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            <div className="flex flex-col justify-center gap-1 overflow-hidden">
              <p className="truncate font-[var(--font-sans)] text-xs font-medium uppercase tracking-widest text-foreground">
                {hotspot.product.name}
              </p>
              <p className="font-[var(--font-sans)] text-xs text-[#C9A96E]">
                ${hotspot.product.price.toLocaleString()}
              </p>
            </div>
          </div>
          <Link
            href={`/product/${hotspot.product.slug}`}
            className="mt-3 block w-full border border-[#C9A96E] py-1.5 text-center font-[var(--font-sans)] text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] transition-colors hover:bg-[#C9A96E] hover:text-background"
            onClick={() => setIsOpen(false)}
          >
            View Product
          </Link>
        </div>
      )}
    </div>
  );
}
