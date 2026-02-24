import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TournamentStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Trophy,
  Plus,
  ArrowRight,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react"
import { format } from "date-fns"

const statusColors: Record<TournamentStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  REGISTRATION_OPEN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  REGISTRATION_CLOSED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  IN_PROGRESS: "bg-secondary/10 text-secondary",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<TournamentStatus, string> = {
  DRAFT: "Draft",
  REGISTRATION_OPEN: "Registration Open",
  REGISTRATION_CLOSED: "Registration Closed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export default async function TournamentsPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ""

  const tournaments = await prisma.tournament.findMany({
    where: { organizerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { teams: true, fixtures: true } },
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground text-sm">
            {tournaments.length} tournament{tournaments.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild className="cursor-pointer w-fit">
          <Link href="/dashboard/tournaments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Tournament
          </Link>
        </Button>
      </div>

      {/* List */}
      {tournaments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-muted rounded-full mb-4">
              <Trophy className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No tournaments yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Create your first tournament to start managing fixtures, teams, and standings.
            </p>
            <Button asChild className="cursor-pointer">
              <Link href="/dashboard/tournaments/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Tournament
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {tournaments.map((t) => (
            <Card key={t.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
                    <Trophy className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {t._count.teams} team{t._count.teams !== 1 ? "s" : ""}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(t.startDate), "d MMM yyyy")}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <Badge className={`text-xs border-0 ${statusColors[t.status]}`}>
                    {t.status === "IN_PROGRESS" && (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    )}
                    {statusLabels[t.status]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="cursor-pointer hidden sm:flex"
                  >
                    <Link href={`/dashboard/tournaments/${t.id}`}>
                      Manage
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
