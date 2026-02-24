"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  TournamentFormat,
  SportType,
  Gender,
  TournamentStatus,
} from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// ─── Create Tournament ──────────────────────────────────────────────────────

const createSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),
  description: z.string().max(500, "Description too long").optional(),
  sport: z.string().refine((v) => Object.values(SportType).includes(v as SportType), {
    message: "Invalid sport",
  }),
  format: z
    .string()
    .refine((v) => Object.values(TournamentFormat).includes(v as TournamentFormat), {
      message: "Invalid format",
    }),
  gender: z
    .string()
    .refine((v) => Object.values(Gender).includes(v as Gender), {
      message: "Invalid gender",
    }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  registrationStart: z.string().optional(),
  registrationEnd: z.string().optional(),
  maxTeams: z.coerce.number().int().min(2, "At least 2 teams").max(256),
  minPlayersPerTeam: z.coerce.number().int().min(1).max(100),
  maxPlayersPerTeam: z.coerce.number().int().min(1).max(100),
  pointsForWin: z.coerce.number().int().min(0),
  pointsForDraw: z.coerce.number().int().min(0),
  pointsForLoss: z.coerce.number().int().min(0),
  numberOfGroups: z.coerce.number().int().min(2).max(32).optional(),
  teamsPerGroup: z.coerce.number().int().min(2).max(32).optional(),
  advancePerGroup: z.coerce.number().int().min(1).max(16).optional(),
  venue: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
})

export type CreateTournamentState = {
  errors?: Record<string, string[]>
  error?: string
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "tournament"
  )
}

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name)
  let slug = base
  let i = 2
  while (await prisma.tournament.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`
  }
  return slug
}

export async function createTournament(
  _prev: CreateTournamentState,
  formData: FormData
): Promise<CreateTournamentState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  // Convert FormData to object — treat empty strings as undefined
  const raw: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    raw[key] = value === "" ? undefined : value
  }

  const parsed = createSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const d = parsed.data
  const sport = d.sport as SportType
  const format = d.format as TournamentFormat
  const gender = d.gender as Gender

  const slug = await uniqueSlug(d.name)

  const tournament = await prisma.tournament.create({
    data: {
      name: d.name,
      slug,
      description: d.description ?? null,
      sport,
      format,
      gender,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      registrationStart: d.registrationStart ? new Date(d.registrationStart) : null,
      registrationEnd: d.registrationEnd ? new Date(d.registrationEnd) : null,
      maxTeams: d.maxTeams,
      minPlayersPerTeam: d.minPlayersPerTeam,
      maxPlayersPerTeam: d.maxPlayersPerTeam,
      pointsForWin: d.pointsForWin,
      pointsForDraw: d.pointsForDraw,
      pointsForLoss: d.pointsForLoss,
      numberOfGroups:
        format === TournamentFormat.GROUP_KNOCKOUT ? (d.numberOfGroups ?? null) : null,
      teamsPerGroup:
        format === TournamentFormat.GROUP_KNOCKOUT ? (d.teamsPerGroup ?? null) : null,
      advancePerGroup:
        format === TournamentFormat.GROUP_KNOCKOUT ? (d.advancePerGroup ?? null) : null,
      venue: d.venue ?? null,
      location: d.location ?? null,
      organizerId: session.user.id,
    },
  })

  revalidatePath("/dashboard/tournaments")
  redirect(`/dashboard/tournaments/${tournament.id}`)
}

// ─── Update Tournament Status ───────────────────────────────────────────────

export type UpdateStatusState = { error?: string }

const STATUS_TRANSITIONS: Partial<Record<TournamentStatus, TournamentStatus[]>> = {
  DRAFT: [TournamentStatus.REGISTRATION_OPEN, TournamentStatus.CANCELLED],
  REGISTRATION_OPEN: [
    TournamentStatus.REGISTRATION_CLOSED,
    TournamentStatus.IN_PROGRESS,
    TournamentStatus.CANCELLED,
  ],
  REGISTRATION_CLOSED: [TournamentStatus.IN_PROGRESS, TournamentStatus.CANCELLED],
  IN_PROGRESS: [TournamentStatus.COMPLETED, TournamentStatus.CANCELLED],
}

export function getAllowedTransitions(current: TournamentStatus): TournamentStatus[] {
  return STATUS_TRANSITIONS[current] ?? []
}

export async function updateTournamentStatus(
  tournamentId: string,
  newStatus: TournamentStatus
): Promise<UpdateStatusState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { organizerId: true, status: true },
  })

  if (!tournament) return { error: "Tournament not found" }
  if (tournament.organizerId !== session.user.id) return { error: "Not authorized" }

  const allowed = STATUS_TRANSITIONS[tournament.status] ?? []
  if (!allowed.includes(newStatus)) {
    return { error: `Cannot transition from ${tournament.status} to ${newStatus}` }
  }

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { status: newStatus },
  })

  revalidatePath(`/dashboard/tournaments/${tournamentId}`)
  revalidatePath("/dashboard/tournaments")
  revalidatePath("/dashboard")
  return {}
}
