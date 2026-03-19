"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Heart, Menu, X, ChevronDown, LogOut, User, Package, LayoutDashboard } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { MegaMenu } from "./mega-menu"
import { CartSidebar } from "./cart-sidebar"
import { SearchOverlay } from "./search-overlay"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "ICONS", href: "/collection" },
  { name: "BAGS", href: "/bags", hasMegaMenu: true },
  { name: "JEWELLERY", href: "/jewellery", hasMegaMenu: true },
  { name: "ACCESSORIES", href: "/accessories", hasMegaMenu: true },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { totalItems, toggleCart } = useCart()
  const { user, isLoading: authLoading, isAdmin, signOut } = useAuth()

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
        setSearchOpen(false)
      }
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName ?? ""))
      ) {
        e.preventDefault()
        setSearchOpen(true)
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
                <Link
                  href="/stores"
                  className="text-[11px] tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300 font-sans font-medium uppercase"
                >
                  BOUTIQUES
                </Link>

                {/* Auth-aware Account section */}
                {!authLoading && (
                  user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:text-primary transition-colors focus-visible:outline-none"
                          aria-label="Account menu"
                        >
                          <User className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-[var(--surface-2)] border-border rounded-none"
                      >
                        <DropdownMenuItem asChild className="cursor-pointer text-[11px] tracking-[0.05em] text-foreground focus:text-primary focus:bg-transparent">
                          <Link href="/account" className="flex items-center gap-3 px-3 py-2.5">
                            <User className="w-3.5 h-3.5" />
                            My Account
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer text-[11px] tracking-[0.05em] text-foreground focus:text-primary focus:bg-transparent">
                          <Link href="/account" className="flex items-center gap-3 px-3 py-2.5">
                            <Package className="w-3.5 h-3.5" />
                            Orders
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem asChild className="cursor-pointer text-[11px] tracking-[0.05em] text-primary focus:text-primary focus:bg-transparent">
                              <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5">
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                Admin Panel
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          className="cursor-pointer text-[11px] tracking-[0.05em] text-muted-foreground focus:text-red-400 focus:bg-transparent"
                          onClick={signOut}
                        >
                          <div className="flex items-center gap-3 px-3 py-2.5">
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="text-[11px] tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300 font-sans font-medium uppercase"
                    >
                      SIGN IN
                    </Link>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="text-[11px] tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300 font-sans font-medium uppercase"
                >
                  SEARCH
                </button>
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

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
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
            <Link
              href="/stores"
              className="text-left text-lg text-text-tertiary hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              BOUTIQUES
            </Link>
            {user ? (
              <>
                <Link
                  href="/account"
                  className="text-left text-lg text-text-tertiary hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  MY ACCOUNT
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-left text-lg text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ADMIN PANEL
                  </Link>
                )}
                <button
                  type="button"
                  className="text-left text-lg text-text-tertiary hover:text-red-400 transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut()
                  }}
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-left text-lg text-text-tertiary hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                SIGN IN
              </Link>
            )}
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); setSearchOpen(true) }}
              className="text-left text-lg text-text-tertiary hover:text-primary transition-colors"
            >
              SEARCH
            </button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
