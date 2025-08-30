"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <nav className="fixed top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 w-full">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">M</span>
          </div>
          <span className="text-xl font-bold">MockMaster</span>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user && (
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Sign out</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
