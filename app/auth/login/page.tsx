"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Suspense } from "react"

/* ──────────────────────────────────────────────
   Login form content (needs useSearchParams)
   ────────────────────────────────────────────── */

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/account"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createBrowserClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "Invalid email or password. Please try again."
            : authError.message
        )
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Cart merge — server-side auth-аар userId авна
        await fetch("/api/cart/merge", { method: "POST" }).catch(() => {})
        router.push(redirect)
        router.refresh()
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Luxury image (desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559563458-527698bf5295?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />

        {/* Overlaid brand mark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-16 left-12"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-3">
            Established 2024
          </p>
          <h2 className="font-serif text-4xl text-foreground/80 font-light tracking-[0.06em] leading-tight">
            The Art of
            <br />
            Timeless Elegance
          </h2>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="block mb-12">
            <h1 className="font-serif text-2xl tracking-[0.2em] text-foreground font-light text-center lg:text-left">
              MAISON ÉLISE
            </h1>
          </Link>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10"
          >
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground font-light tracking-[0.04em] mb-3">
              Welcome Back
            </h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Sign in to your Maison Élise account
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-900/40 mb-8"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-red-200 leading-relaxed">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <label
                htmlFor="email"
                className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-transparent border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300"
                placeholder="your@email.com"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <label
                htmlFor="password"
                className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-transparent border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="pt-2"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex items-center gap-4 my-8"
          >
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              or
            </span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Create account link */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-[12px] text-muted-foreground mb-4">
              Don&apos;t have an account?
            </p>
            <Link
              href={`/auth/signup${redirect !== "/account" ? `?redirect=${redirect}` : ""}`}
              className="inline-block w-full h-12 leading-[48px] text-center border border-border text-[11px] uppercase tracking-[0.15em] text-foreground font-medium hover:border-primary hover:text-primary transition-all duration-300"
            >
              Create Account
            </Link>
          </motion.div>

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 text-center"
          >
            <Link
              href="/"
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              Return to Homepage
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Page wrapper with Suspense
   ────────────────────────────────────────────── */

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
