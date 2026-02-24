"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FixtureStatus, TournamentFormat } from "@prisma/client"
import { revalidatePath } from "next/cache"

// ─── Update Score ────────────────────────────────────────────────────────────

export async function updateFixtureScore(
  fixtureId: string,
  homeScore: number,
  awayScore: number
): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const fixture = await prisma.fixture.findUnique({
    where: { id: fixtureId },
    include: { tournament: { select: { organizerId: true, id: true } } },
  })

  if (!fixture) return { error: "Fixture not found" }
  if (fixture.tournament.organizerId !== session.user.id) return { error: "Not authorized" }

  await prisma.fixture.update({
    where: { id: fixtureId },
    data: {
      homeScore,
      awayScore,
      status: FixtureStatus.COMPLETED,
    },
  })

  revalidatePath("/dashboard/fixtures")
  revalidatePath("/dashboard/standings")
  revalidatePath(`/dashboard/tournaments/${fixture.tournament.id}`)
  revalidatePath(`/t`, "layout")
  return {}
}

// ─── Update Fixture Status ────────────────────────────────────────────────────

export async function updateFixtureStatus(
  fixtureId: string,
  status: FixtureStatus
): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const fixture = await prisma.fixture.findUnique({
    where: { id: fixtureId },
    include: { tournament: { select: { organizerId: true, id: true } } },
  })

  if (!fixture) return { error: "Fixture not found" }
  if (fixture.tournament.organizerId !== session.user.id) return { error: "Not authorized" }

  await prisma.fixture.update({ where: { id: fixtureId }, data: { status } })

  revalidatePath("/dashboard/fixtures")
  revalidatePath(`/dashboard/tournaments/${fixture.tournament.id}`)
  return {}
}

// ─── Generate Fixtures (Round Robin) ─────────────────────────────────────────

export async function generateFixtures(
  tournamentId: string
): Promise<{ error?: string; count?: number }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      teams: { where: { status: "APPROVED" }, select: { id: true } },
      _count: { select: { fixtures: true } },
    },
  })

  if (!tournament) return { error: "Tournament not found" }
  if (tournament.organizerId !== session.user.id) return { error: "Not authorized" }

  if (tournament._count.fixtures > 0) {
    return { error: "Fixtures already exist. Delete them first before regenerating." }
  }

  const teamIds = tournament.teams.map((t) => t.id)

  if (teamIds.length < 2) {
    return { error: "Need at least 2 approved teams to generate fixtures" }
  }

  let fixtures: Array<{
    homeTeamId: string
    awayTeamId: string
    round: number
    matchNumber: number
  }> = []

  if (tournament.format === TournamentFormat.ROUND_ROBIN || tournament.format === TournamentFormat.GROUP_KNOCKOUT) {
    fixtures = generateRoundRobin(teamIds)
  } else if (tournament.format === TournamentFormat.SINGLE_ELIMINATION) {
    fixtures = generateKnockout(teamIds)
  }

  await prisma.fixture.createMany({
    data: fixtures.map((f) => ({
      ...f,
      tournamentId,
      status: FixtureStatus.SCHEDULED,
    })),
  })

  revalidatePath("/dashboard/fixtures")
  revalidatePath(`/dashboard/tournaments/${tournamentId}`)
  revalidatePath("/dashboard")
  return { count: fixtures.length }
}

// ─── Round-Robin Algorithm ────────────────────────────────────────────────────

function generateRoundRobin(teamIds: string[]) {
  const BYE = "__bye__"
  const list: (string | typeof BYE)[] =
    teamIds.length % 2 === 0 ? [...teamIds] : [...teamIds, BYE]
  const n = list.length
  const numRounds = n - 1
  const fixtures: Array<{
    homeTeamId: string
    awayTeamId: string
    round: number
    matchNumber: number
  }> = []

  for (let round = 0; round < numRounds; round++) {
    let matchNumber = 1
    for (let i = 0; i < n / 2; i++) {
      const home = list[i]
      const away = list[n - 1 - i]
      if (home !== BYE && away !== BYE) {
        fixtures.push({
          homeTeamId: home as string,
          awayTeamId: away as string,
          round: round + 1,
          matchNumber: matchNumber++,
        })
      }
    }
    // Circle rotation: keep list[0] fixed, rotate the rest
    const last = list.splice(n - 1, 1)[0]
    list.splice(1, 0, last)
  }

  return fixtures
}

// ─── Single-Elimination Algorithm ────────────────────────────────────────────

function generateKnockout(teamIds: string[]) {
  // Pad to the next power of 2
  const size = Math.pow(2, Math.ceil(Math.log2(teamIds.length)))
  const padded: (string | null)[] = [...teamIds]
  while (padded.length < size) padded.push(null)

  const fixtures: Array<{
    homeTeamId: string
    awayTeamId: string
    round: number
    matchNumber: number
  }> = []

  // Only generate round 1 — subsequent rounds are seeded by results
  let matchNumber = 1
  for (let i = 0; i < size / 2; i++) {
    const home = padded[i]
    const away = padded[size - 1 - i]
    if (home && away) {
      fixtures.push({
        homeTeamId: home,
        awayTeamId: away,
        round: 1,
        matchNumber: matchNumber++,
      })
    }
  }

  return fixtures
}
