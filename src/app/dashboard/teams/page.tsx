import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TeamStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserRound } from "lucide-react"
import Link from "next/link"
import { TournamentFilter } from "@/components/tournament-filter"
import { AddTeamSheet } from "./add-team-sheet"
import { TeamActions } from "./team-actions"

const STATUS_COLORS: Record<TeamStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  WITHDRAWN: "bg-muted text-muted-foreground",
}

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ tournament?: string }>
}) {
  const { tournament: tournamentId } = await searchParams
  const session = await auth()
  const userId = session?.user?.id ?? ""

  const [tournaments, teams] = await Promise.all([
    prisma.tournament.findMany({
      where: { organizerId: userId },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.team.findMany({
      where: {
        tournament: { organizerId: userId },
        ...(tournamentId ? { tournamentId } : {}),
      },
      include: {
        tournament: { select: { id: true, name: true } },
        _count: { select: { players: true } },
      },
      orderBy: [{ tournament: { name: "asc" } }, { name: "asc" }],
    }),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground text-sm">
            {teams.length} team{teams.length !== 1 ? "s" : ""}
            {tournamentId ? " in this tournament" : " across all tournaments"}
          </p>
        </div>
        <AddTeamSheet tournaments={tournaments} defaultTournamentId={tournamentId} />
      </div>

      {/* Filter */}
      <TournamentFilter tournaments={tournaments} currentId={tournamentId} />

      {/* Teams list */}
      {teams.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-muted rounded-full mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No teams yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {tournamentId
                ? "Add teams to this tournament to get started."
                : "Create a tournament and add teams to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
                    <Users className="h-4 w-4 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{team.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <UserRound className="h-3 w-3" />
                        {team._count.players} player{team._count.players !== 1 ? "s" : ""}
                      </span>
                      <span>·</span>
                      <Link
                        href={`/dashboard/tournaments/${team.tournament.id}`}
                        className="hover:text-foreground truncate max-w-[160px]"
                      >
                        {team.tournament.name}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Badge
                    className={`text-xs border-0 hidden sm:flex ${STATUS_COLORS[team.status]}`}
                  >
                    {team.status.charAt(0) + team.status.slice(1).toLowerCase()}
                  </Badge>
                  <TeamActions team={team} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
