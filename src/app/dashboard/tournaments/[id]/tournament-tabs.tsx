"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { TournamentStatus, TournamentFormat, SportType, Gender } from "@prisma/client"
import { updateTournamentStatus, getAllowedTransitions } from "../actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Users,
  Calendar,
  MapPin,
  Trophy,
  Settings2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

// ─── Types ──────────────────────────────────────────────────────────────────

type Team = {
  id: string
  name: string
  shortName: string | null
  status: string
  _count: { players: number }
}

type Fixture = {
  id: string
  round: number
  matchNumber: number
  status: string
  scheduledDate: Date | null
  scheduledTime: string | null
  venue: string | null
  homeScore: number | null
  awayScore: number | null
  homeTeam: { id: string; name: string } | null
  awayTeam: { id: string; name: string } | null
}

type Tournament = {
  id: string
  name: string
  description: string | null
  sport: SportType
  format: TournamentFormat
  gender: Gender
  status: TournamentStatus
  startDate: Date
  endDate: Date | null
  registrationStart: Date | null
  registrationEnd: Date | null
  venue: string | null
  location: string | null
  maxTeams: number
  minPlayersPerTeam: number
  maxPlayersPerTeam: number
  pointsForWin: number
  pointsForDraw: number
  pointsForLoss: number
  numberOfGroups: number | null
  teamsPerGroup: number | null
  advancePerGroup: number | null
  teams: Team[]
  fixtures: Fixture[]
  _count: { teams: number; fixtures: number }
}

// ─── Static maps ────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<TournamentStatus, string> = {
  DRAFT: "Draft",
  REGISTRATION_OPEN: "Registration Open",
  REGISTRATION_CLOSED: "Registration Closed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

const STATUS_COLORS: Record<TournamentStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  REGISTRATION_OPEN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  REGISTRATION_CLOSED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  IN_PROGRESS: "bg-secondary/10 text-secondary",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const TEAM_STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  WITHDRAWN: "bg-muted text-muted-foreground",
}

const FIXTURE_STATUS_ICON: Record<string, React.ReactNode> = {
  SCHEDULED: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  IN_PROGRESS: <Loader2 className="h-3.5 w-3.5 text-secondary animate-spin" />,
  COMPLETED: <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />,
  POSTPONED: <Clock className="h-3.5 w-3.5 text-yellow-600" />,
  CANCELLED: <XCircle className="h-3.5 w-3.5 text-red-500" />,
}

const SPORT_LABELS: Record<SportType, string> = {
  FOOTBALL: "Football",
  BASKETBALL: "Basketball",
  VOLLEYBALL: "Volleyball",
  NETBALL: "Netball",
  RUGBY: "Rugby",
  CRICKET: "Cricket",
  ATHLETICS: "Athletics",
  OTHER: "Other",
}

const FORMAT_LABELS: Record<TournamentFormat, string> = {
  ROUND_ROBIN: "Round Robin",
  SINGLE_ELIMINATION: "Knockout",
  GROUP_KNOCKOUT: "Group Stage + Knockout",
}

const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  MIXED: "Mixed",
}

// ─── Status Change Button ────────────────────────────────────────────────────

function StatusChanger({
  tournamentId,
  currentStatus,
}: {
  tournamentId: string
  currentStatus: TournamentStatus
}) {
  const [isPending, startTransition] = useTransition()
  const allowed = getAllowedTransitions(currentStatus)

  if (allowed.length === 0) return null

  function handleChange(newStatus: TournamentStatus) {
    startTransition(async () => {
      const result = await updateTournamentStatus(tournamentId, newStatus)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending} className="cursor-pointer">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Settings2 className="mr-2 h-4 w-4" />
          )}
          Change Status
          <ChevronDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allowed.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => handleChange(s)}
            className="cursor-pointer"
          >
            {STATUS_LABELS[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TournamentTabs({ tournament }: { tournament: Tournament }) {
  // Group fixtures by round
  const rounds = Array.from(new Set(tournament.fixtures.map((f) => f.round))).sort(
    (a, b) => a - b
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{tournament.name}</h1>
          </div>
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
              {STATUS_LABELS[tournament.status]}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusChanger
            tournamentId={tournament.id}
            currentStatus={tournament.status}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Teams</p>
              <p className="font-semibold text-sm">
                {tournament._count.teams} / {tournament.maxTeams}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-secondary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Fixtures</p>
              <p className="font-semibold text-sm">{tournament._count.fixtures}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-secondary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Starts</p>
              <p className="font-semibold text-sm">
                {format(new Date(tournament.startDate), "d MMM yy")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-semibold text-sm truncate">
                {tournament.location ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">
            Teams{tournament._count.teams > 0 && ` (${tournament._count.teams})`}
          </TabsTrigger>
          <TabsTrigger value="fixtures">
            Fixtures{tournament._count.fixtures > 0 && ` (${tournament._count.fixtures})`}
          </TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          {tournament.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-2">
                <p className="text-sm">{tournament.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">
                    {format(new Date(tournament.startDate), "d MMM yyyy")}
                  </span>
                </div>
                {tournament.endDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-medium">
                      {format(new Date(tournament.endDate), "d MMM yyyy")}
                    </span>
                  </div>
                )}
                {tournament.registrationStart && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reg. Opens</span>
                    <span className="font-medium">
                      {format(new Date(tournament.registrationStart), "d MMM yyyy")}
                    </span>
                  </div>
                )}
                {tournament.registrationEnd && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reg. Closes</span>
                    <span className="font-medium">
                      {format(new Date(tournament.registrationEnd), "d MMM yyyy")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Venue */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Venue
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-2 space-y-2 text-sm">
                {tournament.venue ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="font-medium">{tournament.venue}</span>
                  </div>
                ) : null}
                {tournament.location ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{tournament.location}</span>
                  </div>
                ) : null}
                {!tournament.venue && !tournament.location && (
                  <p className="text-muted-foreground">No venue set.</p>
                )}
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Team Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Teams</span>
                  <span className="font-medium">{tournament.maxTeams}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players / Team</span>
                  <span className="font-medium">
                    {tournament.minPlayersPerTeam}–{tournament.maxPlayersPerTeam}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Points */}
            {tournament.format !== "SINGLE_ELIMINATION" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Points System
                  </CardTitle>
                </CardHeader>
                <CardContent className="-mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win</span>
                    <span className="font-medium">{tournament.pointsForWin} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Draw</span>
                    <span className="font-medium">{tournament.pointsForDraw} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loss</span>
                    <span className="font-medium">{tournament.pointsForLoss} pts</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Group Stage Config */}
            {tournament.format === "GROUP_KNOCKOUT" &&
              tournament.numberOfGroups && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Group Stage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="-mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Groups</span>
                      <span className="font-medium">{tournament.numberOfGroups}</span>
                    </div>
                    {tournament.teamsPerGroup && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teams/Group</span>
                        <span className="font-medium">{tournament.teamsPerGroup}</span>
                      </div>
                    )}
                    {tournament.advancePerGroup && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Advance</span>
                        <span className="font-medium">
                          {tournament.advancePerGroup} per group
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
          </div>
        </TabsContent>

        {/* ── Teams Tab ── */}
        <TabsContent value="teams" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {tournament._count.teams} of {tournament.maxTeams} teams registered
              </p>
              <Button size="sm" className="cursor-pointer" asChild>
                <Link href={`/dashboard/teams?tournament=${tournament.id}`}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Teams
                </Link>
              </Button>
            </div>

            {tournament.teams.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium">No teams yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Teams will appear here once they register.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-2">
                {tournament.teams.map((team) => (
                  <Card key={team.id}>
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-secondary/10 rounded-md">
                          <Users className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {team._count.players} player
                            {team._count.players !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs border-0 ${TEAM_STATUS_BADGE[team.status] ?? ""}`}
                      >
                        {team.status.charAt(0) + team.status.slice(1).toLowerCase()}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Fixtures Tab ── */}
        <TabsContent value="fixtures" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {tournament._count.fixtures} fixture
                {tournament._count.fixtures !== 1 ? "s" : ""}
              </p>
              <Button size="sm" className="cursor-pointer" asChild>
                <Link href={`/dashboard/fixtures?tournament=${tournament.id}`}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Manage Fixtures
                </Link>
              </Button>
            </div>

            {tournament.fixtures.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium">No fixtures yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate fixtures once your teams are registered.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rounds.map((round) => (
                  <div key={round}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Round {round}
                    </p>
                    <div className="grid gap-2">
                      {tournament.fixtures
                        .filter((f) => f.round === round)
                        .map((fixture) => (
                          <Card key={fixture.id}>
                            <CardContent className="p-3 flex items-center gap-3">
                              <div className="shrink-0">
                                {FIXTURE_STATUS_ICON[fixture.status]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">
                                  {fixture.homeTeam?.name ?? "TBD"}{" "}
                                  <span className="text-muted-foreground">vs</span>{" "}
                                  {fixture.awayTeam?.name ?? "TBD"}
                                </p>
                                {fixture.scheduledDate && (
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(fixture.scheduledDate), "d MMM yyyy")}
                                    {fixture.scheduledTime && ` · ${fixture.scheduledTime}`}
                                  </p>
                                )}
                              </div>
                              {fixture.status === "COMPLETED" &&
                                fixture.homeScore !== null &&
                                fixture.awayScore !== null && (
                                  <div className="shrink-0 text-sm font-semibold">
                                    {fixture.homeScore} – {fixture.awayScore}
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
