import { PrismaClient, TournamentStatus, TournamentFormat, SportType, Gender, TeamStatus, FixtureStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // ── Demo organizer account ──────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 12)

  const organizer = await prisma.user.upsert({
    where: { email: "demo@tournapilot.ug" },
    update: {},
    create: {
      name: "Demo Organizer",
      email: "demo@tournapilot.ug",
      passwordHash,
      role: "ORGANIZER",
    },
  })

  console.log(`✓ Demo account: ${organizer.email} / password123`)

  // ── Sample tournament ───────────────────────────────────────────────────────
  const existing = await prisma.tournament.findFirst({
    where: { organizerId: organizer.id },
  })

  if (existing) {
    console.log("✓ Tournament already exists — skipping seed data")
    return
  }

  const tournament = await prisma.tournament.create({
    data: {
      name: "Kampala Schools Cup 2026",
      slug: "kampala-schools-cup-2026",
      description: "Annual inter-schools football tournament for secondary schools in Kampala district.",
      sport: SportType.FOOTBALL,
      format: TournamentFormat.ROUND_ROBIN,
      status: TournamentStatus.IN_PROGRESS,
      gender: Gender.MALE,
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-04-30"),
      registrationStart: new Date("2026-01-15"),
      registrationEnd: new Date("2026-02-28"),
      maxTeams: 8,
      minPlayersPerTeam: 11,
      maxPlayersPerTeam: 18,
      pointsForWin: 3,
      pointsForDraw: 1,
      pointsForLoss: 0,
      venue: "Nakivubo Stadium",
      location: "Kampala",
      organizerId: organizer.id,
    },
  })

  console.log(`✓ Tournament: ${tournament.name}`)

  // ── 6 teams ─────────────────────────────────────────────────────────────────
  const teamNames = [
    ["Ntare Lions", "NTR"],
    ["Bat Valley Eagles", "BVE"],
    ["St. Mary's Killers", "SMK"],
    ["Kampala High Rangers", "KHR"],
    ["Old Kampala Strikers", "OKS"],
    ["Kibuli FC", "KBL"],
  ]

  const teams = await Promise.all(
    teamNames.map(([name, shortName]) =>
      prisma.team.create({
        data: {
          name,
          shortName,
          tournamentId: tournament.id,
          status: TeamStatus.APPROVED,
        },
      })
    )
  )

  console.log(`✓ ${teams.length} teams created`)

  // ── Players (3 per team for seed purposes) ───────────────────────────────────
  const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"]
  let playerCount = 0

  for (const team of teams) {
    for (let i = 1; i <= 3; i++) {
      await prisma.player.create({
        data: {
          firstName: `Player${i}`,
          lastName: team.shortName ?? team.name,
          jerseyNumber: i,
          position: positions[i % positions.length],
          teamId: team.id,
        },
      })
      playerCount++
    }
  }

  console.log(`✓ ${playerCount} players created`)

  // ── Round-robin fixtures (first 3 rounds played) ─────────────────────────────
  const fixtures = [
    // Round 1 — completed
    { home: 0, away: 5, hs: 2, as: 0, status: FixtureStatus.COMPLETED },
    { home: 1, away: 4, hs: 1, as: 1, status: FixtureStatus.COMPLETED },
    { home: 2, away: 3, hs: 0, as: 2, status: FixtureStatus.COMPLETED },
    // Round 2 — completed
    { home: 0, away: 4, hs: 3, as: 1, status: FixtureStatus.COMPLETED },
    { home: 5, away: 3, hs: 1, as: 0, status: FixtureStatus.COMPLETED },
    { home: 1, away: 2, hs: 2, as: 2, status: FixtureStatus.COMPLETED },
    // Round 3 — scheduled
    { home: 0, away: 3, hs: null, as: null, status: FixtureStatus.SCHEDULED },
    { home: 4, away: 2, hs: null, as: null, status: FixtureStatus.SCHEDULED },
    { home: 5, away: 1, hs: null, as: null, status: FixtureStatus.SCHEDULED },
  ]

  await Promise.all(
    fixtures.map((f, idx) =>
      prisma.fixture.create({
        data: {
          tournamentId: tournament.id,
          homeTeamId: teams[f.home].id,
          awayTeamId: teams[f.away].id,
          round: idx < 3 ? 1 : idx < 6 ? 2 : 3,
          matchNumber: (idx % 3) + 1,
          homeScore: f.hs,
          awayScore: f.as,
          status: f.status,
          scheduledDate: new Date("2026-03-15"),
        },
      })
    )
  )

  console.log(`✓ ${fixtures.length} fixtures created`)
  console.log("\n✅ Seed complete!")
  console.log(`   Login: demo@tournapilot.ug / password123`)
  console.log(`   Public: http://localhost:3000/t/kampala-schools-cup-2026`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
