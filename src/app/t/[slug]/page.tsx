import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TournamentFormat, TournamentStatus, SportType, Gender } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, MapPin, TrendingUp, CheckCircle2, Clock, Play } from "lucide-react"
import { format } from "date-fns"
import { computeStandings } from "@/lib/standings"
import { Logo } from "@/components/logo"

const STATUS_COLORS: Record<TournamentStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  REGISTRATION_OPEN: "bg-blue-100 text-blue-700",
  REGISTRATION_CLOSED: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-secondary/10 text-secondary",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
}

const STATUS_LABELS: Record<TournamentStatus, string> = {
  DRAFT: "Draft",
  REGISTRATION_OPEN: "Registration Open",
  REGISTRATION_CLOSED: "Registration Closed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

const SPORT_LABELS: Record<SportType, string> = {
  FOOTBALL: "Football", BASKETBALL: "Basketball", VOLLEYBALL: "Volleyball",
  NETBALL: "Netball", RUGBY: "Rugby", CRICKET: "Cricket",
  ATHLETICS: "Athletics", OTHER: "Other",
}

const FORMAT_LABELS: Record<TournamentFormat, string> = {
  ROUND_ROBIN: "Round Robin",
  SINGLE_ELIMINATION: "Knockout",
  GROUP_KNOCKOUT: "Group Stage + Knockout",
}

const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Male", FEMALE: "Female", MIXED: "Mixed",
}

const FIXTURE_STATUS_ICON: Record<string, React.ReactNode> = {
  SCHEDULED: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  IN_PROGRESS: <Play className="h-3.5 w-3.5 text-secondary" />,
  COMPLETED: <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />,
}

export default async function PublicTournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: {
      organizer: { select: { name: true } },
      teams: {
        where: { status: "APPROVED" },
        select: { id: true, name: true, shortName: true },
        orderBy: { name: "asc" },
      },
      fixtures: {
        include: {
          homeTeam: { select: { id: true, name: true } },
          awayTeam: { select: { id: true, name: true } },
        },
        orderBy: [{ round: "asc" }, { matchNumber: "asc" }],
      },
      _count: { select: { teams: true, fixtures: true } },
    },
  })

  if (!tournament) notFound()

  const standings =
    tournament.format !== TournamentFormat.SINGLE_ELIMINATION
      ? computeStandings(
          tournament.teams,
          tournament.fixtures,
          tournament.pointsForWin,
          tournament.pointsForDraw,
          tournament.pointsForLoss
        )
      : []

  // Group fixtures by round
  const rounds = Array.from(new Set(tournament.fixtures.map((f) => f.round))).sort(
    (a, b) => a - b
  )

  const completedFixtures = tournament.fixtures.filter((f) => f.status === "COMPLETED")
  const upcomingFixtures = tournament.fixtures.filter((f) => f.status === "SCHEDULED")

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo href="/" variant="square" height={28} />
          <span className="text-xs text-muted-foreground">Powered by TournaPilot360</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Tournament header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {SPORT_LABELS[tournament.sport]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {FORMAT_LABELS[tournament.format]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {GENDER_LABELS[tournament.gender]}
            </Badge>
            <Badge className={`text-xs border-0 ${STATUS_COLORS[tournament.status]}`}>
              {tournament.status === "IN_PROGRESS" && (
                <TrendingUp className="mr-1 h-3 w-3" />
              )}
              {STATUS_LABELS[tournament.status]}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>

          {tournament.description && (
            <p className="text-muted-foreground">{tournament.description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(tournament.startDate), "d MMM yyyy")}
              {tournament.endDate &&
                ` – ${format(new Date(tournament.endDate), "d MMM yyyy")}`}
            </span>
            {tournament.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {tournament.venue ? `${tournament.venue}, ` : ""}{tournament.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {tournament._count.teams} team{tournament._count.teams !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              {completedFixtures.length} / {tournament._count.fixtures} matches played
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={tournament.format !== TournamentFormat.SINGLE_ELIMINATION ? "standings" : "fixtures"}>
          <TabsList>
            {tournament.format !== TournamentFormat.SINGLE_ELIMINATION && (
              <TabsTrigger value="standings">Standings</TabsTrigger>
            )}
            <TabsTrigger value="fixtures">
              Fixtures ({tournament._count.fixtures})
            </TabsTrigger>
            <TabsTrigger value="teams">
              Teams ({tournament._count.teams})
            </TabsTrigger>
          </TabsList>

          {/* ── Standings Tab ── */}
          {tournament.format !== TournamentFormat.SINGLE_ELIMINATION && (
            <TabsContent value="standings" className="mt-4">
              {standings.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    No results yet — check back once matches have been played.
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-xs text-muted-foreground">
                            <th className="text-left pl-4 py-2 w-8">#</th>
                            <th className="text-left py-2">Team</th>
                            <th className="text-center py-2 w-10">P</th>
                            <th className="text-center py-2 w-10">W</th>
                            <th className="text-center py-2 w-10">D</th>
                            <th className="text-center py-2 w-10">L</th>
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
                              className={`${idx === 0 ? "bg-secondary/5" : ""}`}
                            >
                              <td className="pl-4 py-2.5 text-muted-foreground font-medium">
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
            </TabsContent>
          )}

          {/* ── Fixtures Tab ── */}
          <TabsContent value="fixtures" className="mt-4 space-y-4">
            {rounds.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  Fixtures have not been published yet.
                </CardContent>
              </Card>
            ) : (
              rounds.map((round) => (
                <Card key={round}>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Round {round}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 divide-y">
                    {tournament.fixtures
                      .filter((f) => f.round === round)
                      .map((fixture) => (
                        <div key={fixture.id} className="flex items-center gap-3 p-3">
                          <div className="shrink-0">
                            {FIXTURE_STATUS_ICON[fixture.status] ?? <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                          </div>
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
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ── Teams Tab ── */}
          <TabsContent value="teams" className="mt-4">
            {tournament.teams.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No teams registered yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {tournament.teams.map((team) => (
                  <Card key={team.id}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Users className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{team.name}</p>
                        {team.shortName && (
                          <p className="text-xs text-muted-foreground">{team.shortName}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
