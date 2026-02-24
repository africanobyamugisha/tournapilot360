export type StandingRow = {
  teamId: string
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

type FixtureInput = {
  homeTeamId: string | null
  awayTeamId: string | null
  homeScore: number | null
  awayScore: number | null
  status: string
}

export function computeStandings(
  teams: Array<{ id: string; name: string }>,
  fixtures: FixtureInput[],
  pointsForWin: number,
  pointsForDraw: number,
  pointsForLoss: number
): StandingRow[] {
  const map = new Map<string, StandingRow>()

  for (const team of teams) {
    map.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    })
  }

  for (const f of fixtures) {
    if (f.status !== "COMPLETED") continue
    if (!f.homeTeamId || !f.awayTeamId) continue
    if (f.homeScore === null || f.awayScore === null) continue

    const home = map.get(f.homeTeamId)
    const away = map.get(f.awayTeamId)
    if (!home || !away) continue

    home.played++
    away.played++
    home.goalsFor += f.homeScore
    home.goalsAgainst += f.awayScore
    away.goalsFor += f.awayScore
    away.goalsAgainst += f.homeScore

    if (f.homeScore > f.awayScore) {
      home.won++
      away.lost++
      home.points += pointsForWin
      away.points += pointsForLoss
    } else if (f.homeScore === f.awayScore) {
      home.drawn++
      away.drawn++
      home.points += pointsForDraw
      away.points += pointsForDraw
    } else {
      home.lost++
      away.won++
      home.points += pointsForLoss
      away.points += pointsForWin
    }

    home.goalDiff = home.goalsFor - home.goalsAgainst
    away.goalDiff = away.goalsFor - away.goalsAgainst
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return a.teamName.localeCompare(b.teamName)
  })
}
