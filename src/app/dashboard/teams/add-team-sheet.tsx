"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { addTeam } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

type Tournament = { id: string; name: string }

export function AddTeamSheet({
  tournaments,
  defaultTournamentId,
}: {
  tournaments: Tournament[]
  defaultTournamentId?: string
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [tournamentId, setTournamentId] = useState(defaultTournamentId ?? "")
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("tournamentId", tournamentId)
    setErrors({})

    startTransition(async () => {
      const result = await addTeam(null, formData)
      if (result.error) {
        toast.error(result.error)
      } else if (result.errors) {
        setErrors(result.errors)
      } else {
        toast.success("Team added successfully")
        setOpen(false)
        formRef.current?.reset()
        setTournamentId(defaultTournamentId ?? "")
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="cursor-pointer w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Add Team
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Team</SheetTitle>
        </SheetHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-6 px-1">
          {/* Tournament */}
          <div>
            <Label>Tournament *</Label>
            <Select
              value={tournamentId}
              onValueChange={setTournamentId}
              required
            >
              <SelectTrigger className="mt-1 w-full cursor-pointer">
                <SelectValue placeholder="Select a tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tournamentId && (
              <p className="text-xs text-destructive mt-1">{errors.tournamentId[0]}</p>
            )}
          </div>

          {/* Team Name */}
          <div>
            <Label htmlFor="team-name">Team Name *</Label>
            <Input
              id="team-name"
              name="name"
              placeholder="e.g. Kampala City FC"
              required
              className="mt-1"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name[0]}</p>
            )}
          </div>

          {/* Short Name */}
          <div>
            <Label htmlFor="team-short">Short Name / Abbreviation</Label>
            <Input
              id="team-short"
              name="shortName"
              placeholder="e.g. KCFC"
              maxLength={10}
              className="mt-1"
            />
          </div>

          {/* Contact Email */}
          <div>
            <Label htmlFor="team-email">Contact Email</Label>
            <Input
              id="team-email"
              name="contactEmail"
              type="email"
              placeholder="team@example.com"
              className="mt-1"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <Label htmlFor="team-phone">Contact Phone</Label>
            <Input
              id="team-phone"
              name="contactPhone"
              type="tel"
              placeholder="+256 700 123 456"
              className="mt-1"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full cursor-pointer mt-2">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding…
              </>
            ) : (
              "Add Team"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
