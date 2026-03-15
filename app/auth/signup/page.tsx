"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Suspense } from "react"

/* ──────────────────────────────────────────────
   Signup form content
   ────────────────────────────────────────────── */

function SignupForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/account"

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)

    try {
      const supabase = createBrowserClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      setIsSuccess(true)
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
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
            backgroundImage: "url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-16 left-12"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-3">
            Join the Maison
          </p>
          <h2 className="font-serif text-4xl text-foreground/80 font-light tracking-[0.06em] leading-tight">
            Begin Your
            <br />
            Journey
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

          <AnimatePresence mode="wait">
            {isSuccess ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="w-16 h-16 border border-primary flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle className="w-7 h-7 text-primary" />
                </motion.div>

                <h2 className="font-serif text-2xl text-foreground font-light tracking-[0.04em] mb-4">
                  Check Your Email
                </h2>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-2 max-w-sm mx-auto">
                  We&apos;ve sent a confirmation link to
                </p>
                <p className="text-[14px] text-primary font-medium mb-8">
                  {email}
                </p>
                <p className="text-[12px] text-muted-foreground leading-relaxed max-w-sm mx-auto mb-8">
                  Click the link in the email to verify your account and complete
                  your registration.
                </p>

                <Link
                  href="/auth/login"
                  className="inline-block w-full h-12 leading-[48px] text-center bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-primary transition-all duration-300"
                >
                  Return to Sign In
                </Link>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                {/* Heading */}
                <div className="mb-10">
                  <h2 className="font-serif text-3xl lg:text-4xl text-foreground font-light tracking-[0.04em] mb-3">
                    Create Account
                  </h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Join the Maison Élise experience
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-900/40 mb-8"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-red-200 leading-relaxed">
                      {error}
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <label
                      htmlFor="fullName"
                      className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 px-4 bg-transparent border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300"
                      placeholder="Your full name"
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                  >
                    <label
                      htmlFor="signup-email"
                      className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 bg-transparent border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300"
                      placeholder="your@email.com"
                    />
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                  >
                    <label
                      htmlFor="signup-password"
                      className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-12 bg-transparent border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300"
                        placeholder="At least 6 characters"
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

                  {/* Confirm Password */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                  >
                    <label
                      htmlFor="confirm-password"
                      className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 px-4 bg-transparent border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300"
                      placeholder="Confirm your password"
                    />
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.55 }}
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
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    <p className="text-[10px] text-muted-foreground text-center mt-3">
                      By creating an account, you agree to our Terms of Service
                      and Privacy Policy
                    </p>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    or
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Login link */}
                <div className="text-center">
                  <p className="text-[12px] text-muted-foreground mb-4">
                    Already have an account?
                  </p>
                  <Link
                    href={`/auth/login${redirect !== "/account" ? `?redirect=${redirect}` : ""}`}
                    className="inline-block w-full h-12 leading-[48px] text-center border border-border text-[11px] uppercase tracking-[0.15em] text-foreground font-medium hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Back to home */}
                <div className="mt-8 text-center">
                  <Link
                    href="/"
                    className="text-[11px] text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Page wrapper with Suspense
   ────────────────────────────────────────────── */

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
