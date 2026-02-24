"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { TeamStatus } from "@prisma/client"
import { updateTeamStatus, deleteTeam } from "./actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react"

type Team = {
  id: string
  status: TeamStatus
  name: string
}

export function TeamActions({ team }: { team: Team }) {
  const [isPending, startTransition] = useTransition()

  function handleStatus(status: TeamStatus) {
    startTransition(async () => {
      const result = await updateTeamStatus(team.id, status)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          status === TeamStatus.APPROVED
            ? `${team.name} approved`
            : `${team.name} rejected`
        )
      }
    })
  }

  function handleDelete() {
    if (!confirm(`Delete "${team.name}"? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteTeam(team.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`${team.name} deleted`)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending} className="cursor-pointer h-8 w-8">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {team.status !== TeamStatus.APPROVED && (
          <DropdownMenuItem
            className="cursor-pointer text-green-600 focus:text-green-600"
            onClick={() => handleStatus(TeamStatus.APPROVED)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </DropdownMenuItem>
        )}
        {team.status !== TeamStatus.REJECTED && (
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => handleStatus(TeamStatus.REJECTED)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
