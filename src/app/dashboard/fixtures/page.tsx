import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import { TournamentFilter } from "@/components/tournament-filter"
import { FixtureRow } from "./fixture-row"
import { GenerateFixturesButton } from "./generate-button"

export default async function FixturesPage({
  searchParams,
}: {
  searchParams: Promise<{ tournament?: string }>
}) {
  const { tournament: tournamentId } = await searchParams
  const session = await auth()
  const userId = session?.user?.id ?? ""

  const [tournaments, fixtures] = await Promise.all([
    prisma.tournament.findMany({
      where: { organizerId: userId },
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.fixture.findMany({
      where: {
        tournament: { organizerId: userId },
        ...(tournamentId ? { tournamentId } : {}),
      },
      include: {
        homeTeam: { select: { id: true, name: true } },
        awayTeam: { select: { id: true, name: true } },
        tournament: { select: { id: true, name: true } },
      },
      orderBy: [{ tournament: { name: "asc" } }, { round: "asc" }, { matchNumber: "asc" }],
    }),
  ])

  // Group by tournament then by round
  const grouped = new Map<
    string,
    {
      tournament: { id: string; name: string }
      rounds: Map<number, typeof fixtures>
    }
  >()

  for (const f of fixtures) {
    const tId = f.tournament.id
    if (!grouped.has(tId)) {
      grouped.set(tId, { tournament: f.tournament, rounds: new Map() })
    }
    const tGroup = grouped.get(tId)!
    if (!tGroup.rounds.has(f.round)) {
      tGroup.rounds.set(f.round, [])
    }
    tGroup.rounds.get(f.round)!.push(f)
  }

  const selectedTournament = tournamentId
    ? tournaments.find((t) => t.id === tournamentId)
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fixtures</h1>
          <p className="text-muted-foreground text-sm">
            {fixtures.length} fixture{fixtures.length !== 1 ? "s" : ""}
            {tournamentId ? " in this tournament" : " across all tournaments"}
          </p>
        </div>
        {tournamentId && fixtures.length === 0 && (
          <GenerateFixturesButton tournamentId={tournamentId} />
        )}
      </div>

      {/* Filter */}
      <TournamentFilter tournaments={tournaments} currentId={tournamentId} />

      {/* Generate prompt if no fixtures for selected tournament */}
      {tournamentId && fixtures.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-muted rounded-full mb-4">
              <CalendarDays className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No fixtures yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Make sure approved teams are registered, then generate the match schedule.
            </p>
            <GenerateFixturesButton tournamentId={tournamentId} />
          </CardContent>
        </Card>
      )}

      {!tournamentId && fixtures.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 bg-muted rounded-full mb-4">
              <CalendarDays className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No fixtures yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Select a tournament above to generate or view its fixture schedule.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Fixtures grouped by tournament → round */}
      {Array.from(grouped.values()).map(({ tournament, rounds }) => (
        <div key={tournament.id} className="space-y-4">
          {!tournamentId && (
            <h2 className="text-base font-semibold text-muted-foreground">
              {tournament.name}
            </h2>
          )}

          {Array.from(rounds.entries())
            .sort(([a], [b]) => a - b)
            .map(([round, roundFixtures]) => (
              <Card key={round}>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Round {round}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {roundFixtures.map((fixture) => (
                    <FixtureRow key={fixture.id} fixture={fixture} />
                  ))}
                </CardContent>
              </Card>
            ))}
        </div>
      ))}
    </div>
  )
}
