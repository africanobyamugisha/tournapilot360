import type { Metadata } from "next"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { SidebarConfigProvider } from "@/contexts/sidebar-context"
import { inter } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "TournaPilot360 — Tournament Management System for Uganda",
  description:
    "The all-in-one sports tournament management platform built for Uganda. Registration, fixtures, live scoring, real-time standings. Works offline, accepts mobile money.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="tournapilot360-theme">
          <SidebarConfigProvider>
            {children}
          </SidebarConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
