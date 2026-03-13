"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Heart, Menu, X, ChevronDown } from "lucide-react"
import { MegaMenu } from "./mega-menu"
import { CartSidebar } from "./cart-sidebar"
import { useCart } from "@/context/cart-context"

const navItems = [
  { name: "ICONS", href: "/collection" },
  { name: "BAGS", href: "/bags", hasMegaMenu: true },
  { name: "JEWELLERY", href: "/jewellery", hasMegaMenu: true },
  { name: "ACCESSORIES", href: "/accessories", hasMegaMenu: true },
]

const rightNavItems = [
  { name: "BOUTIQUES", href: "/stores" },
  { name: "ACCOUNT", href: "/account" },
  { name: "SEARCH", href: "/search" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { totalItems, toggleCart } = useCart()

  const handleKeyDown = useCallback((e: React.KeyboardEvent, itemName: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setActiveMegaMenu(prev => prev === itemName ? null : itemName)
    } else if (e.key === "Escape") {
      setActiveMegaMenu(null)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMegaMenu(null)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md py-4"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Left Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasMegaMenu && setActiveMegaMenu(item.name)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-[11px] tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300 font-sans font-medium uppercase"
                    {...(item.hasMegaMenu ? {
                      "aria-haspopup": "true",
                      "aria-expanded": activeMegaMenu === item.name,
                      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, item.name),
                    } : {})}
                  >
                    {item.name}
                    {item.hasMegaMenu && <ChevronDown className="w-3 h-3" />}
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-foreground p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl md:text-3xl tracking-[0.2em] text-foreground hover:text-primary transition-colors duration-300"
            >
              MAISON ÉLISE
            </Link>

            {/* Right Navigation */}
            <div className="flex items-center gap-6 md:gap-8">
              <div className="hidden lg:flex items-center gap-8">
                {rightNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[11px] tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300 font-sans font-medium uppercase"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <button type="button" className="relative text-foreground hover:text-primary transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="relative text-foreground hover:text-primary transition-colors"
                aria-label="Shopping bag"
                onClick={toggleCart}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-background text-[10px] flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mega Menu */}
        {activeMegaMenu === "BAGS" && (
          <nav
            aria-label="Bags menu"
            onMouseEnter={() => setActiveMegaMenu("BAGS")}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <MegaMenu />
          </nav>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-left text-2xl font-serif text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border my-4" />
            {rightNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-left text-lg text-text-tertiary hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
