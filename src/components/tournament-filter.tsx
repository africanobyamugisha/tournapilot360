"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TournamentFilter({
  tournaments,
  currentId,
}: {
  tournaments: { id: string; name: string }[]
  currentId?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(value: string) {
    const url = value === "all" ? pathname : `${pathname}?tournament=${value}`
    router.replace(url)
  }

  return (
    <Select value={currentId ?? "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[240px] cursor-pointer">
        <SelectValue placeholder="All tournaments" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All tournaments</SelectItem>
        {tournaments.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
