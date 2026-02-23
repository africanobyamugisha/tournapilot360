import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Users,
  UserRound,
  CalendarDays,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import { TournamentStatus } from "@prisma/client"

async function getDashboardStats(userId: string) {
  const [activeTournaments, totalTeams, totalPlayers, upcomingFixtures] =
    await Promise.all([
      prisma.tournament.count({
        where: {
          organizerId: userId,
          status: { in: [TournamentStatus.ACTIVE, TournamentStatus.REGISTRATION] },
        },
      }),
      prisma.team.count({
        where: { tournament: { organizerId: userId } },
      }),
      prisma.player.count({
        where: { team: { tournament: { organizerId: userId } } },
      }),
      prisma.fixture.count({
        where: {
          tournament: { organizerId: userId },
          status: "SCHEDULED",
        },
      }),
    ])

  return { activeTournaments, totalTeams, totalPlayers, upcomingFixtures }
}

async function getRecentTournaments(userId: string) {
  return prisma.tournament.findMany({
    where: { organizerId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: { select: { teams: true, fixtures: true } },
    },
  })
}

const statusColors: Record<TournamentStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  REGISTRATION: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ACTIVE: "bg-secondary/10 text-secondary",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id ?? ""

  const [stats, recentTournaments] = await Promise.all([
    getDashboardStats(userId),
    getRecentTournaments(userId),
  ])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </p>
        </div>
        <Button asChild className="cursor-pointer w-fit">
          <Link href="/dashboard/tournaments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Tournament
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Tournaments
            </CardTitle>
            <div className="p-1.5 bg-secondary/10 rounded-lg">
              <Trophy className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTournaments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Running or accepting registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Teams
            </CardTitle>
            <div className="p-1.5 bg-secondary/10 rounded-lg">
              <Users className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeams}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all your tournaments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Players
            </CardTitle>
            <div className="p-1.5 bg-secondary/10 rounded-lg">
              <UserRound className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered and profiled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Fixtures
            </CardTitle>
            <div className="p-1.5 bg-secondary/10 rounded-lg">
              <CalendarDays className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingFixtures}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled and not yet played
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tournaments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Tournaments</h2>
          <Button variant="ghost" size="sm" asChild className="cursor-pointer">
            <Link href="/dashboard/tournaments">
              View all
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {recentTournaments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-3 bg-muted rounded-full mb-4">
                <Trophy className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No tournaments yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Create your first tournament to get started with TournaPilot360.
              </p>
              <Button asChild className="cursor-pointer">
                <Link href="/dashboard/tournaments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Tournament
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {recentTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
                      <Trophy className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{tournament.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {tournament._count.teams} teams · {tournament._count.fixtures} fixtures
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Badge
                      className={`text-xs border-0 ${statusColors[tournament.status]}`}
                    >
                      {tournament.status === "ACTIVE" && (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      )}
                      {tournament.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="cursor-pointer hidden sm:flex"
                    >
                      <Link href={`/dashboard/tournaments/${tournament.id}`}>
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
    </div>
  )
}
