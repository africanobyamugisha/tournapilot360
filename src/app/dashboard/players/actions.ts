"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Gender } from "@prisma/client"
import { revalidatePath } from "next/cache"

// ─── Add Player ──────────────────────────────────────────────────────────────

export type AddPlayerState = {
  errors?: Record<string, string[]>
  error?: string
  success?: boolean
}

export async function addPlayer(
  _prev: AddPlayerState | null,
  formData: FormData
): Promise<AddPlayerState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const teamId = formData.get("teamId") as string
  const firstName = (formData.get("firstName") as string)?.trim()
  const lastName = (formData.get("lastName") as string)?.trim()
  const jerseyNumber = formData.get("jerseyNumber") as string
  const position = (formData.get("position") as string)?.trim() || null
  const gender = (formData.get("gender") as string) || null
  const phone = (formData.get("phone") as string)?.trim() || null
  const email = (formData.get("email") as string)?.trim() || null
  const dateOfBirth = formData.get("dateOfBirth") as string

  const errors: Record<string, string[]> = {}
  if (!teamId) errors.teamId = ["Please select a team"]
  if (!firstName || firstName.length < 1) errors.firstName = ["First name is required"]
  if (!lastName || lastName.length < 1) errors.lastName = ["Last name is required"]
  if (Object.keys(errors).length > 0) return { errors }

  // Verify team ownership through tournament
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { tournament: { select: { organizerId: true, id: true } } },
  })

  if (!team) return { error: "Team not found" }
  if (team.tournament.organizerId !== session.user.id) return { error: "Not authorized" }

  await prisma.player.create({
    data: {
      firstName,
      lastName,
      teamId,
      jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : null,
      position,
      gender: (gender as Gender) || null,
      phone,
      email,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    },
  })

  revalidatePath("/dashboard/players")
  revalidatePath("/dashboard/teams")
  revalidatePath(`/dashboard/tournaments/${team.tournament.id}`)
  revalidatePath("/dashboard")
  return { success: true }
}

// ─── Delete Player ────────────────────────────────────────────────────────────

export async function deletePlayer(playerId: string): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      team: {
        include: { tournament: { select: { organizerId: true, id: true } } },
      },
    },
  })

  if (!player) return { error: "Player not found" }
  if (player.team.tournament.organizerId !== session.user.id) {
    return { error: "Not authorized" }
  }

  await prisma.player.delete({ where: { id: playerId } })

  revalidatePath("/dashboard/players")
  revalidatePath("/dashboard/teams")
  revalidatePath(`/dashboard/tournaments/${player.team.tournament.id}`)
  revalidatePath("/dashboard")
  return {}
}
