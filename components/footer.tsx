"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const footerLinks = {
  brand: [
    { label: "Store Locations", href: "/stores" },
    { label: "Craftsmanship", href: "/about/craftsmanship" },
    { label: "Sustainable Projects", href: "/about/sustainability" },
    { label: "Careers", href: "/careers" },
  ],
  shipping: [
    { label: "Shipping & Taxes", href: "/shipping" },
    { label: "Make a Return", href: "/returns" },
    { label: "Help & Questions", href: "/help" },
  ],
  legal: [
    { label: "General Terms", href: "/legal/terms" },
    { label: "Legal Mentions", href: "/legal/mentions" },
    { label: "Privacy Policy", href: "/legal/privacy" },
  ],
  social: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
}

export function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={sectionRef} className="py-16 lg:py-24 bg-background border-t border-border">
      <div className="px-6 lg:px-12">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Brand */}
          <div>
            <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-6">
              Brand
            </h3>
            <ul className="space-y-3">
              {footerLinks.brand.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[12px] text-text-tertiary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipping */}
          <div>
            <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-6">
              Shipping & Taxes
            </h3>
            <ul className="space-y-3">
              {footerLinks.shipping.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[12px] text-text-tertiary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-6">
              General Terms
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[12px] text-text-tertiary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-6">
              Social
            </h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} target="_blank" rel="noopener noreferrer" className="text-[12px] text-text-tertiary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Icons - Desktop */}
          <div className="hidden lg:block">
            <h3 className="text-[11px] tracking-[0.15em] text-foreground uppercase mb-6">
              Payment
            </h3>
            <div className="flex flex-wrap gap-3">
              {["VISA", "MC", "PayPal", "Amex"].map((payment) => (
                <div
                  key={payment}
                  className="px-3 py-1.5 bg-card border border-border text-[10px] text-text-tertiary"
                >
                  {payment}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[11px] text-text-tertiary">
            © MAISON ÉLISE 2026
          </p>

          {/* Payment Icons - Mobile */}
          <div className="flex lg:hidden flex-wrap gap-2 justify-center">
            {["VISA", "MC", "PayPal", "Amex"].map((payment) => (
              <div
                key={payment}
                className="px-2 py-1 bg-card border border-border text-[9px] text-text-tertiary"
              >
                {payment}
              </div>
            ))}
          </div>

          <Link href="/" className="font-serif text-xl tracking-[0.2em] text-foreground hover:text-primary transition-colors">
            MAISON ÉLISE
          </Link>
        </div>
      </div>
    </footer>
  )
}
