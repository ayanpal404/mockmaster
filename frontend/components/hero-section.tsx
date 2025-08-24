"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export function HeroSection() {
  const router = useRouter()
  const { user } = useAuth()

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <section className="h-[90vh] relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-32 sm:py-36 flex">
        <div className="mx-auto max-w-4xl text-center pt-20">
          <div className="mb-2 inline-flex items-center rounded-full border bg-white/50 px-4 py-2 text-sm font-medium text-gray-600 backdrop-blur-sm dark:bg-gray-800/50 dark:text-gray-300">
            <Play className="mr-2 h-4 w-4" />
            AI-Powered Interview Practice
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Crack Every Round with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Confidence!
            </span>
          </h1>

          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">
            Practice real interview rounds with AI-generated questions tailored for your dream role.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group px-8 py-3 text-lg" onClick={handleGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 opacity-20 blur-3xl"></div>
      </div>
    </section>
  )
}
