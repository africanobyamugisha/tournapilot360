import { Logo } from "@/components/logo"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link href="/landing" className="inline-block">
          <Logo height={32} />
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TournaPilot360 · Uganda&apos;s Tournament Platform
      </footer>
    </div>
  )
}
