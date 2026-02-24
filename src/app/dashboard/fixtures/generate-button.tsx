"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { generateFixtures } from "./actions"
import { Button } from "@/components/ui/button"
import { Wand2, Loader2 } from "lucide-react"

export function GenerateFixturesButton({ tournamentId }: { tournamentId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleGenerate() {
    if (!confirm("Generate fixtures for all approved teams? This cannot be undone.")) return
    startTransition(async () => {
      const result = await generateFixtures(tournamentId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`${result.count} fixtures generated!`)
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isPending}
      className="cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Generate Fixtures
    </Button>
  )
}
