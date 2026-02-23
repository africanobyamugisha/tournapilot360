import type { Metadata } from "next"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { SidebarConfigProvider } from "@/contexts/sidebar-context"
import { SessionProvider } from "@/components/session-provider"
import { inter } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "TournaPilot360 — Tournament Management System for Uganda",
  description:
    "The all-in-one sports tournament management platform built for Uganda. Registration, fixtures, live scoring, real-time standings. Works offline, accepts mobile money.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon-precomposed.png", rel: "apple-touch-icon-precomposed" },
    ],
    other: [
      { rel: "manifest", url: "/manifest.json" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider defaultTheme="light" storageKey="tournapilot360-theme">
            <SidebarConfigProvider>
              {children}
            </SidebarConfigProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
