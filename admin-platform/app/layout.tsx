import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { ColorThemeProvider } from "@/contexts/color-theme-context"
import { ModalProvider } from "@/contexts/modal-context"
import "./globals.css"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata = {
  title: "TestGenius AI - AI-Powered Test Generation Platform",
  description: "Create professional, customized tests in seconds with our advanced AI technology.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <ColorThemeProvider>
            <LanguageProvider>
              <ModalProvider>{children}</ModalProvider>
            </LanguageProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'