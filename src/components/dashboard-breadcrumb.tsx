"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  tournaments: "Tournaments",
  teams: "Teams",
  players: "Players",
  fixtures: "Fixtures",
  standings: "Standings",
  new: "New Tournament",
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  // e.g. /dashboard/tournaments/abc123 → ["dashboard", "tournaments", "abc123"]
  const segments = pathname.split("/").filter(Boolean)

  // Build breadcrumb items
  const crumbs: { label: string; href: string; isLast: boolean }[] = []

  let path = ""
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    path += `/${seg}`
    const isLast = i === segments.length - 1

    // Skip "dashboard" as it's always the first crumb
    if (seg === "dashboard" && !isLast) continue

    // Dynamic segment (tournament ID) — show "Tournament" as label
    const label =
      SEGMENT_LABELS[seg] ??
      (seg.length > 16
        ? seg === "new"
          ? "New"
          : "Detail"
        : SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1))

    crumbs.push({ label, href: path, isLast })
  }

  // If only "dashboard" segment, show Overview
  if (crumbs.length === 0) {
    crumbs.push({ label: "Overview", href: "/dashboard", isLast: true })
  }

  return (
    <Breadcrumb className="flex-1">
      <BreadcrumbList>
        {crumbs.map((crumb, idx) =>
          crumb.isLast ? (
            <BreadcrumbItem key={crumb.href}>
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={crumb.href}>
              <BreadcrumbLink asChild>
                <Link href={crumb.href}>{crumb.label}</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
