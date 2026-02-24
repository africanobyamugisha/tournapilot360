"use client"

import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { addPlayer } from "./actions"
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

type TeamOption = { id: string; name: string; tournamentName: string }

const POSITIONS = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
  "Winger",
  "Striker",
  "Libero",
  "Setter",
  "Other",
]

export function AddPlayerSheet({
  teams,
  defaultTeamId,
}: {
  teams: TeamOption[]
  defaultTeamId?: string
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [teamId, setTeamId] = useState(defaultTeamId ?? "")
  const [gender, setGender] = useState("")
  const [position, setPosition] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("teamId", teamId)
    formData.set("gender", gender)
    formData.set("position", position)
    setErrors({})

    startTransition(async () => {
      const result = await addPlayer(null, formData)
      if (result.error) {
        toast.error(result.error)
      } else if (result.errors) {
        setErrors(result.errors)
      } else {
        toast.success("Player added successfully")
        setOpen(false)
        formRef.current?.reset()
        setTeamId(defaultTeamId ?? "")
        setGender("")
        setPosition("")
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="cursor-pointer w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Player</SheetTitle>
        </SheetHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-6 px-1">
          {/* Team */}
          <div>
            <Label>Team *</Label>
            <Select value={teamId} onValueChange={setTeamId} required>
              <SelectTrigger className="mt-1 w-full cursor-pointer">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                    <span className="text-muted-foreground ml-1 text-xs">
                      · {t.tournamentName}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teamId && (
              <p className="text-xs text-destructive mt-1">{errors.teamId[0]}</p>
            )}
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="p-first">First Name *</Label>
              <Input
                id="p-first"
                name="firstName"
                placeholder="John"
                required
                className="mt-1"
              />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-1">{errors.firstName[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="p-last">Last Name *</Label>
              <Input
                id="p-last"
                name="lastName"
                placeholder="Mukasa"
                required
                className="mt-1"
              />
              {errors.lastName && (
                <p className="text-xs text-destructive mt-1">{errors.lastName[0]}</p>
              )}
            </div>
          </div>

          {/* Jersey + Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="p-jersey">Jersey Number</Label>
              <Input
                id="p-jersey"
                name="jerseyNumber"
                type="number"
                min={1}
                max={99}
                placeholder="10"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="mt-1 w-full cursor-pointer">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gender + DOB */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="mt-1 w-full cursor-pointer">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="MIXED">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="p-dob">Date of Birth</Label>
              <Input id="p-dob" name="dateOfBirth" type="date" className="mt-1" />
            </div>
          </div>

          {/* Phone + Email */}
          <div>
            <Label htmlFor="p-phone">Phone</Label>
            <Input
              id="p-phone"
              name="phone"
              type="tel"
              placeholder="+256 700 123 456"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="p-email">Email</Label>
            <Input
              id="p-email"
              name="email"
              type="email"
              placeholder="player@example.com"
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
              "Add Player"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
