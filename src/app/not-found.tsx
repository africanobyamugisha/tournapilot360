import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="p-4 bg-secondary/10 rounded-2xl mb-6">
        <Trophy className="h-10 w-10 text-secondary" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-2">404</h1>
      <p className="text-xl font-medium mb-1">Page not found</p>
      <p className="text-muted-foreground mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Button asChild className="cursor-pointer">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild className="cursor-pointer">
          <Link href="/landing">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
