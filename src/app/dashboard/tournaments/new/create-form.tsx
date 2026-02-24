"use client"

import { useActionState, useState } from "react"
import { createTournament, type CreateTournamentState } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// ─── Static option lists ────────────────────────────────────────────────────

const SPORTS = [
  { value: "FOOTBALL", label: "Football" },
  { value: "BASKETBALL", label: "Basketball" },
  { value: "VOLLEYBALL", label: "Volleyball" },
  { value: "NETBALL", label: "Netball" },
  { value: "RUGBY", label: "Rugby" },
  { value: "CRICKET", label: "Cricket" },
  { value: "ATHLETICS", label: "Athletics" },
  { value: "OTHER", label: "Other" },
]

const FORMATS = [
  {
    value: "ROUND_ROBIN",
    label: "Round Robin",
    description: "Every team plays against every other team",
  },
  {
    value: "SINGLE_ELIMINATION",
    label: "Knockout",
    description: "Lose once and you're out — single-elimination bracket",
  },
  {
    value: "GROUP_KNOCKOUT",
    label: "Group Stage + Knockout",
    description: "Teams play in groups, top teams advance to knockout rounds",
  },
]

const GENDERS = [
  { value: "MIXED", label: "Mixed" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
]

// ─── Field error helper ─────────────────────────────────────────────────────

function FieldError({ errors, field }: { errors?: Record<string, string[]>; field: string }) {
  const msgs = errors?.[field]
  if (!msgs?.length) return null
  return <p className="text-xs text-destructive mt-1">{msgs[0]}</p>
}

// ─── Component ──────────────────────────────────────────────────────────────

export function CreateTournamentForm() {
  const [state, formAction, isPending] = useActionState<CreateTournamentState, FormData>(
    createTournament,
    {}
  )
  const [format, setFormat] = useState("ROUND_ROBIN")

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* ── Basic Information ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="name">Tournament Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Kampala Schools Cup 2026"
              required
              className="mt-1"
            />
            <FieldError errors={state.errors} field="name" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional — describe the tournament, rules, or any important notes"
              rows={3}
              className="mt-1 resize-none"
            />
            <FieldError errors={state.errors} field="description" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="sport">Sport *</Label>
              <Select name="sport" defaultValue="FOOTBALL" required>
                <SelectTrigger id="sport" className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.errors} field="sport" />
            </div>

            <div>
              <Label htmlFor="gender">Category</Label>
              <Select name="gender" defaultValue="MIXED">
                <SelectTrigger id="gender" className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={state.errors} field="gender" />
            </div>
          </div>

          <div>
            <Label htmlFor="format">Format *</Label>
            <Select
              name="format"
              defaultValue="ROUND_ROBIN"
              onValueChange={setFormat}
            >
              <SelectTrigger id="format" className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {format && (
              <p className="text-xs text-muted-foreground mt-1">
                {FORMATS.find((f) => f.value === format)?.description}
              </p>
            )}
            <FieldError errors={state.errors} field="format" />
          </div>
        </CardContent>
      </Card>

      {/* ── Schedule ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schedule</CardTitle>
          <CardDescription>Set your tournament dates. Only start date is required.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input id="startDate" name="startDate" type="date" required className="mt-1" />
            <FieldError errors={state.errors} field="startDate" />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" name="endDate" type="date" className="mt-1" />
            <FieldError errors={state.errors} field="endDate" />
          </div>

          <div>
            <Label htmlFor="registrationStart">Registration Opens</Label>
            <Input
              id="registrationStart"
              name="registrationStart"
              type="date"
              className="mt-1"
            />
            <FieldError errors={state.errors} field="registrationStart" />
          </div>

          <div>
            <Label htmlFor="registrationEnd">Registration Closes</Label>
            <Input
              id="registrationEnd"
              name="registrationEnd"
              type="date"
              className="mt-1"
            />
            <FieldError errors={state.errors} field="registrationEnd" />
          </div>
        </CardContent>
      </Card>

      {/* ── Teams & Players ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Teams &amp; Players</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="maxTeams">Max Teams</Label>
            <Input
              id="maxTeams"
              name="maxTeams"
              type="number"
              defaultValue={16}
              min={2}
              max={256}
              className="mt-1"
            />
            <FieldError errors={state.errors} field="maxTeams" />
          </div>

          <div>
            <Label htmlFor="minPlayersPerTeam">Min Players/Team</Label>
            <Input
              id="minPlayersPerTeam"
              name="minPlayersPerTeam"
              type="number"
              defaultValue={7}
              min={1}
              max={100}
              className="mt-1"
            />
            <FieldError errors={state.errors} field="minPlayersPerTeam" />
          </div>

          <div>
            <Label htmlFor="maxPlayersPerTeam">Max Players/Team</Label>
            <Input
              id="maxPlayersPerTeam"
              name="maxPlayersPerTeam"
              type="number"
              defaultValue={25}
              min={1}
              max={100}
              className="mt-1"
            />
            <FieldError errors={state.errors} field="maxPlayersPerTeam" />
          </div>
        </CardContent>
      </Card>

      {/* ── Points System (hidden for single elimination) ── */}
      {format !== "SINGLE_ELIMINATION" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Points System</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="pointsForWin">Points for Win</Label>
              <Input
                id="pointsForWin"
                name="pointsForWin"
                type="number"
                defaultValue={3}
                min={0}
                max={99}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="pointsForDraw">Points for Draw</Label>
              <Input
                id="pointsForDraw"
                name="pointsForDraw"
                type="number"
                defaultValue={1}
                min={0}
                max={99}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="pointsForLoss">Points for Loss</Label>
              <Input
                id="pointsForLoss"
                name="pointsForLoss"
                type="number"
                defaultValue={0}
                min={0}
                max={99}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* hidden inputs for points when single elimination */}
      {format === "SINGLE_ELIMINATION" && (
        <>
          <input type="hidden" name="pointsForWin" value="3" />
          <input type="hidden" name="pointsForDraw" value="0" />
          <input type="hidden" name="pointsForLoss" value="0" />
        </>
      )}

      {/* ── Group Stage Config (only for GROUP_KNOCKOUT) ── */}
      {format === "GROUP_KNOCKOUT" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Group Stage</CardTitle>
            <CardDescription>Configure how teams are split into groups.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="numberOfGroups">Number of Groups</Label>
              <Input
                id="numberOfGroups"
                name="numberOfGroups"
                type="number"
                defaultValue={4}
                min={2}
                max={32}
                className="mt-1"
              />
              <FieldError errors={state.errors} field="numberOfGroups" />
            </div>

            <div>
              <Label htmlFor="teamsPerGroup">Teams per Group</Label>
              <Input
                id="teamsPerGroup"
                name="teamsPerGroup"
                type="number"
                defaultValue={4}
                min={2}
                max={32}
                className="mt-1"
              />
              <FieldError errors={state.errors} field="teamsPerGroup" />
            </div>

            <div>
              <Label htmlFor="advancePerGroup">Teams Advancing</Label>
              <Input
                id="advancePerGroup"
                name="advancePerGroup"
                type="number"
                defaultValue={2}
                min={1}
                max={16}
                className="mt-1"
              />
              <FieldError errors={state.errors} field="advancePerGroup" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Venue ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Venue</CardTitle>
          <CardDescription>Optional — where will the tournament be held?</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="venue">Venue Name</Label>
            <Input
              id="venue"
              name="venue"
              placeholder="e.g. Nakivubo Stadium"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location">District / City</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g. Kampala"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="cursor-pointer min-w-32">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            "Create Tournament"
          )}
        </Button>
      </div>
    </form>
  )
}
