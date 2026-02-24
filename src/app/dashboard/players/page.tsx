import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserRound, Trash2 } from "lucide-react"
import { TournamentFilter } from "@/components/tournament-filter"
import { AddPlayerSheet } from "./add-player-sheet"
import { DeletePlayerButton } from "./delete-player-button"

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ tournament?: string }>
}) {
  const { tournament: tournamentId } = await searchParams
  const session = await auth()
  const userId = session?.user?.id ?? ""

  const [tournaments, players, teams] = await Promise.all([
    prisma.tournament.findMany({
      where: { organizerId: userId },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.player.findMany({
      where: {
        team: {
          tournament: { organizerId: userId },
          ...(tournamentId ? { tournamentId } : {}),
        },
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            tournament: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
    // Teams for the add player sheet
    prisma.team.findMany({
      where: {
        tournament: { organizerId: userId },
        ...(tournamentId ? { tournamentId } : {}),
        status: "APPROVED",
      },
      select: {
        id: true,
        name: true,
        tournament: { select: { name: true } },
      },
      orderBy: [{ tournament: { name: "asc" } }, { name: "asc" }],
    }),
  ])

  const teamOptions = teams.map((t) => ({
    id: t.id,
    name: t.name,
    tournamentName: t.tournament.name,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground text-sm">
            {players.length} player{players.length !== 1 ? "s" : ""}
            {tournamentId ? " in this tournament" : " across all tournaments"}
          </p>
        </div>
        <AddPlayerSheet teams={teamOptions} />
      </div>

      {/* Filter */}
      <TournamentFilter tournaments={tournaments} currentId={tournamentId} />

      {/* Players list */}
      {players.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-muted rounded-full mb-4">
              <UserRound className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No players yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Add players to teams to build your squad lists.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <Card key={player.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="text-secondary font-semibold text-sm">
                      {player.jerseyNumber ?? "—"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {player.firstName} {player.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {player.position ?? "No position"} · {player.team.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {player.team.tournament.name}
                    </p>
                  </div>
                </div>
                <DeletePlayerButton playerId={player.id} playerName={`${player.firstName} ${player.lastName}`} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
