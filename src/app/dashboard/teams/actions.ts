"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TeamStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

// ─── Add Team ───────────────────────────────────────────────────────────────

export type AddTeamState = {
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
}

export async function addTeam(
  _prev: AddTeamState | null,
  formData: FormData
): Promise<AddTeamState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const tournamentId = formData.get("tournamentId") as string
  const name = (formData.get("name") as string)?.trim()
  const shortName = (formData.get("shortName") as string)?.trim() || null
  const contactEmail = (formData.get("contactEmail") as string)?.trim() || null
  const contactPhone = (formData.get("contactPhone") as string)?.trim() || null

  const errors: Record<string, string[]> = {}
  if (!tournamentId) errors.tournamentId = ["Please select a tournament"]
  if (!name || name.length < 2) errors.name = ["Team name must be at least 2 characters"]
  if (Object.keys(errors).length > 0) return { errors }

  // Verify ownership
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { organizerId: true, maxTeams: true, _count: { select: { teams: true } } },
  })

  if (!tournament || tournament.organizerId !== session.user.id) {
    return { error: "Tournament not found or not authorized" }
  }

  if (tournament._count.teams >= tournament.maxTeams) {
    return { error: `Tournament is full (max ${tournament.maxTeams} teams)` }
  }

  // Check for duplicate team name in this tournament
  const existing = await prisma.team.findUnique({
    where: { tournamentId_name: { tournamentId, name } },
  })
  if (existing) {
    return { errors: { name: ["A team with this name already exists in this tournament"] } }
  }

  await prisma.team.create({
    data: {
      name,
      shortName,
      contactEmail,
      contactPhone,
      tournamentId,
      status: TeamStatus.APPROVED, // organizer-added teams are auto-approved
    },
  })

  revalidatePath("/dashboard/teams")
  revalidatePath(`/dashboard/tournaments/${tournamentId}`)
  revalidatePath("/dashboard")
  return { success: true }
}

// ─── Update Team Status ──────────────────────────────────────────────────────

export async function updateTeamStatus(
  teamId: string,
  status: TeamStatus
): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { tournament: { select: { organizerId: true, id: true } } },
  })

  if (!team) return { error: "Team not found" }
  if (team.tournament.organizerId !== session.user.id) return { error: "Not authorized" }

  await prisma.team.update({ where: { id: teamId }, data: { status } })

  revalidatePath("/dashboard/teams")
  revalidatePath(`/dashboard/tournaments/${team.tournament.id}`)
  return {}
}

// ─── Delete Team ─────────────────────────────────────────────────────────────

export async function deleteTeam(teamId: string): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { tournament: { select: { organizerId: true, id: true } } },
  })

  if (!team) return { error: "Team not found" }
  if (team.tournament.organizerId !== session.user.id) return { error: "Not authorized" }

  await prisma.team.delete({ where: { id: teamId } })

  revalidatePath("/dashboard/teams")
  revalidatePath(`/dashboard/tournaments/${team.tournament.id}`)
  revalidatePath("/dashboard")
  return {}
}
