"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
})

export const useAuth = () => {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initializeAuth = async () => {
      try {
        // Dynamic import to ensure this only runs on client
        const { auth } = await import("@/lib/firebase")
        const { onAuthStateChanged } = await import("firebase/auth")

        if (!auth) {
          throw new Error("Firebase auth not initialized")
        }

        unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            setUser(user)
            setLoading(false)
            setError(null)
          },
          (error) => {
            console.error("Auth state change error:", error)
            setError(error.message)
            setLoading(false)
          },
        )
      } catch (error: any) {
        console.error("Firebase auth initialization error:", error)
        setError(error.message || "Failed to initialize authentication")
        setLoading(false)
      }
    }

    initializeAuth()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const value = {
    user,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
