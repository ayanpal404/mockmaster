"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import AuthService, { type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
})

export const useAuth = () => {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authService = AuthService.getInstance()

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if user is already authenticated
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error: any) {
        console.error("Auth initialization error:", error)
        setError(error.message || "Failed to initialize authentication")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authService.login(email, password)
      setUser(response.user)
    } catch (error: any) {
      setError(error.message || "Login failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authService.register(name, email, password)
      setUser(response.user)
    } catch (error: any) {
      setError(error.message || "Registration failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authService.logout()
      setUser(null)
      setError(null)
    } catch (error: any) {
      console.error("Logout error:", error)
      // Even if logout fails on server, clear user locally
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
