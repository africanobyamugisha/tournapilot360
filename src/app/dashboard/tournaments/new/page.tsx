import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateTournamentForm } from "./create-form"

export default function NewTournamentPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="cursor-pointer shrink-0">
          <Link href="/dashboard/tournaments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Tournament</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details to create your tournament.
          </p>
        </div>
      </div>

      <CreateTournamentForm />
    </div>
  )
}
