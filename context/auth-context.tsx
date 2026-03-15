"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient()

    async function initAuth() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
      setIsLoading(false)
    }
    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      const newUser = session?.user ?? null
      setUser(newUser)

      if (_event === "SIGNED_IN" || _event === "SIGNED_OUT") {
        window.dispatchEvent(new CustomEvent("auth-state-changed"))
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/"
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, signOut }),
    [user, isLoading, signOut]
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
