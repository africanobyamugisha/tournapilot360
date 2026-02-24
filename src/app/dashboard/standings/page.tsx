import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TournamentFormat } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp } from "lucide-react"
import { TournamentFilter } from "@/components/tournament-filter"
import { computeStandings } from "@/lib/standings"

export default async function StandingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tournament?: string }>
}) {
  const { tournament: tournamentId } = await searchParams
  const session = await auth()
  const userId = session?.user?.id ?? ""

  const tournaments = await prisma.tournament.findMany({
    where: { organizerId: userId },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  })

  // For each tournament (or just the selected one), compute standings
  const tournamentsToShow = tournamentId
    ? tournaments.filter((t) => t.id === tournamentId)
    : tournaments

  const standingsData = await Promise.all(
    tournamentsToShow.map(async (t) => {
      const tournament = await prisma.tournament.findUnique({
        where: { id: t.id },
        select: {
          id: true,
          name: true,
          format: true,
          pointsForWin: true,
          pointsForDraw: true,
          pointsForLoss: true,
          teams: {
            where: { status: "APPROVED" },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
          },
          fixtures: {
            select: {
              homeTeamId: true,
              awayTeamId: true,
              homeScore: true,
              awayScore: true,
              status: true,
            },
          },
        },
      })

      if (!tournament) return null

      const standings = computeStandings(
        tournament.teams,
        tournament.fixtures,
        tournament.pointsForWin,
        tournament.pointsForDraw,
        tournament.pointsForLoss
      )

      return { tournament, standings }
    })
  )

  const validStandings = standingsData.filter(Boolean) as NonNullable<
    (typeof standingsData)[number]
  >[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Standings</h1>
          <p className="text-muted-foreground text-sm">Live league tables</p>
        </div>
      </div>

      {/* Filter */}
      <TournamentFilter tournaments={tournaments} currentId={tournamentId} />

      {/* No tournaments */}
      {tournaments.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-muted rounded-full mb-4">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No standings yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Create a tournament, add teams, generate fixtures, and enter scores to see standings.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Standings tables */}
      {validStandings.map(({ tournament, standings }) => (
        <div key={tournament.id}>
          {!tournamentId && (
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              {tournament.name}
              {tournament.format === TournamentFormat.SINGLE_ELIMINATION && (
                <Badge variant="outline" className="text-xs">Knockout</Badge>
              )}
            </h2>
          )}

          {tournament.format === TournamentFormat.SINGLE_ELIMINATION ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                <p>Standings are not applicable for knockout tournaments.</p>
                <p className="mt-1">View the Fixtures page to track bracket progress.</p>
              </CardContent>
            </Card>
          ) : standings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No approved teams found for this tournament.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  League Table
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th className="text-left pl-4 py-2 w-8">#</th>
                        <th className="text-left py-2 min-w-[140px]">Team</th>
                        <th className="text-center py-2 w-10">P</th>
                        <th className="text-center py-2 w-10">W</th>
                        <th className="text-center py-2 w-10">D</th>
                        <th className="text-center py-2 w-10">L</th>
                        <th className="text-center py-2 w-12 hidden sm:table-cell">GF</th>
                        <th className="text-center py-2 w-12 hidden sm:table-cell">GA</th>
                        <th className="text-center py-2 w-12">GD</th>
                        <th className="text-center py-2 w-12 pr-4 font-semibold text-foreground">
                          Pts
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {standings.map((row, idx) => (
                        <tr
                          key={row.teamId}
                          className={`${idx === 0 ? "bg-secondary/5" : ""} hover:bg-muted/30 transition-colors`}
                        >
                          <td className="pl-4 py-2.5 text-muted-foreground font-medium w-8">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 font-medium">
                            {idx === 0 && (
                              <TrendingUp className="inline mr-1.5 h-3 w-3 text-secondary" />
                            )}
                            {row.teamName}
                          </td>
                          <td className="text-center py-2.5 tabular-nums">{row.played}</td>
                          <td className="text-center py-2.5 tabular-nums text-green-600 font-medium">
                            {row.won}
                          </td>
                          <td className="text-center py-2.5 tabular-nums">{row.drawn}</td>
                          <td className="text-center py-2.5 tabular-nums text-destructive">
                            {row.lost}
                          </td>
                          <td className="text-center py-2.5 tabular-nums hidden sm:table-cell">
                            {row.goalsFor}
                          </td>
                          <td className="text-center py-2.5 tabular-nums hidden sm:table-cell">
                            {row.goalsAgainst}
                          </td>
                          <td className="text-center py-2.5 tabular-nums">
                            {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                          </td>
                          <td className="text-center py-2.5 pr-4 font-bold tabular-nums text-secondary">
                            {row.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  )
}
