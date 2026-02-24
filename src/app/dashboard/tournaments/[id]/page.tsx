import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TournamentTabs } from "./tournament-tabs"

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const userId = session?.user?.id ?? ""

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      teams: {
        include: {
          _count: { select: { players: true } },
        },
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
  if (tournament.organizerId !== userId) redirect("/dashboard/tournaments")

  return <TournamentTabs tournament={tournament} />
}
