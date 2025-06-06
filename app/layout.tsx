import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import TopNavbar from "@/components/top-navbar"
import HelpButton from "@/components/help-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Survey Platform",
  description: "Create and manage surveys for your brand",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <TopNavbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <HelpButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
