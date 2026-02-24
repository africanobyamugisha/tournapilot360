"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { FixtureStatus } from "@prisma/client"
import { updateFixtureScore, updateFixtureStatus } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Pencil,
  MoreHorizontal,
  Play,
} from "lucide-react"
import { format } from "date-fns"

type Fixture = {
  id: string
  round: number
  matchNumber: number
  status: FixtureStatus
  scheduledDate: Date | null
  scheduledTime: string | null
  venue: string | null
  homeScore: number | null
  awayScore: number | null
  homeTeam: { id: string; name: string } | null
  awayTeam: { id: string; name: string } | null
}

const STATUS_CONFIG: Record<
  FixtureStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  SCHEDULED: {
    label: "Scheduled",
    color: "bg-muted text-muted-foreground",
    icon: <Clock className="h-3 w-3" />,
  },
  IN_PROGRESS: {
    label: "Live",
    color: "bg-secondary/10 text-secondary",
    icon: <Play className="h-3 w-3" />,
  },
  COMPLETED: {
    label: "FT",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  POSTPONED: {
    label: "Postponed",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: <Clock className="h-3 w-3" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: <XCircle className="h-3 w-3" />,
  },
}

export function FixtureRow({ fixture }: { fixture: Fixture }) {
  const [scoreOpen, setScoreOpen] = useState(false)
  const [homeScore, setHomeScore] = useState(String(fixture.homeScore ?? ""))
  const [awayScore, setAwayScore] = useState(String(fixture.awayScore ?? ""))
  const [isPending, startTransition] = useTransition()

  const cfg = STATUS_CONFIG[fixture.status]

  function handleSaveScore() {
    const hs = parseInt(homeScore)
    const as = parseInt(awayScore)
    if (isNaN(hs) || isNaN(as) || hs < 0 || as < 0) {
      toast.error("Please enter valid scores (0 or higher)")
      return
    }
    startTransition(async () => {
      const result = await updateFixtureScore(fixture.id, hs, as)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Score saved")
        setScoreOpen(false)
      }
    })
  }

  function handleStatusChange(status: FixtureStatus) {
    startTransition(async () => {
      const result = await updateFixtureStatus(fixture.id, status)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Match marked as ${STATUS_CONFIG[status].label}`)
      }
    })
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3">
        {/* Status badge */}
        <Badge className={`text-xs border-0 shrink-0 flex items-center gap-1 ${cfg.color}`}>
          {cfg.icon}
          {cfg.label}
        </Badge>

        {/* Teams & score */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="truncate">{fixture.homeTeam?.name ?? "TBD"}</span>
            {fixture.status === "COMPLETED" ? (
              <span className="font-bold shrink-0 tabular-nums">
                {fixture.homeScore} – {fixture.awayScore}
              </span>
            ) : (
              <span className="text-muted-foreground shrink-0">vs</span>
            )}
            <span className="truncate">{fixture.awayTeam?.name ?? "TBD"}</span>
          </div>
          {fixture.scheduledDate && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(fixture.scheduledDate), "d MMM yyyy")}
              {fixture.scheduledTime && ` · ${fixture.scheduledTime}`}
              {fixture.venue && ` · ${fixture.venue}`}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {fixture.status !== "CANCELLED" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScoreOpen(true)}
              className="cursor-pointer hidden sm:flex text-xs"
              disabled={isPending}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Score
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer h-8 w-8"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer sm:hidden"
                onClick={() => setScoreOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Enter Score
              </DropdownMenuItem>
              {fixture.status !== "IN_PROGRESS" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleStatusChange(FixtureStatus.IN_PROGRESS)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Mark as Live
                </DropdownMenuItem>
              )}
              {fixture.status !== "POSTPONED" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleStatusChange(FixtureStatus.POSTPONED)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Postpone
                </DropdownMenuItem>
              )}
              {fixture.status !== "CANCELLED" && (
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => handleStatusChange(FixtureStatus.CANCELLED)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              )}
              {fixture.status !== "SCHEDULED" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleStatusChange(FixtureStatus.SCHEDULED)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Reset to Scheduled
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Score Dialog */}
      <Dialog open={scoreOpen} onOpenChange={setScoreOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter Score</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1 truncate">
                  {fixture.homeTeam?.name ?? "Home"}
                </p>
                <Input
                  type="number"
                  min={0}
                  max={999}
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="text-center text-xl font-bold h-14"
                  autoFocus
                />
              </div>
              <span className="text-muted-foreground font-bold text-xl mt-6">–</span>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1 truncate">
                  {fixture.awayTeam?.name ?? "Away"}
                </p>
                <Input
                  type="number"
                  min={0}
                  max={999}
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="text-center text-xl font-bold h-14"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScoreOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveScore} disabled={isPending} className="cursor-pointer">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
