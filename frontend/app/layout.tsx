import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { FirebaseErrorBoundary } from "@/components/firebase-error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MockMaster - Smart Interview Preparation Platform",
  description: "Practice real interview rounds with AI-generated questions tailored for your dream role.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FirebaseErrorBoundary>
            <AuthProvider>{children}</AuthProvider>
          </FirebaseErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
