"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const isSigningOutRef = useRef(false)

  useEffect(() => {
    const supabase = createBrowserClient()

    // onAuthStateChange fires INITIAL_SESSION on first register — no need for separate initAuth
    const { data: listener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (isSigningOutRef.current) return

      const newUser = session?.user ?? null
      setUser(newUser)
      if (newUser) {
        const res = await fetch("/api/auth/me")
        const json = await res.json()
        setIsAdmin(json.isAdmin === true)
      } else {
        setIsAdmin(false)
      }

      setIsLoading(false)

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        window.dispatchEvent(new CustomEvent("auth-state-changed"))
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    isSigningOutRef.current = true
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    router.push("/")
    router.refresh()
    isSigningOutRef.current = false
  }, [router])

  const value = useMemo(
    () => ({ user, isLoading, isAdmin, signOut }),
    [user, isLoading, isAdmin, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
