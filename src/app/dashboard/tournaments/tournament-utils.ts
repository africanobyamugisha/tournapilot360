import { TournamentStatus } from "@prisma/client"

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
