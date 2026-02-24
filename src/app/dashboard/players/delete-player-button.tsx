"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { deletePlayer } from "./actions"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"

export function DeletePlayerButton({
  playerId,
  playerName,
}: {
  playerId: string
  playerName: string
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`Remove "${playerName}" from the team?`)) return
    startTransition(async () => {
      const result = await deletePlayer(playerId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`${playerName} removed`)
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={handleDelete}
      className="cursor-pointer h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}
