# TournaPilot360 — Claude Code Guide

## Project overview

Uganda's all-in-one sports tournament management system. Built with Next.js 16 App Router, PostgreSQL (Prisma v6), NextAuth.js v5, and shadcn/ui. Runs in Docker. Works offline. Accepts MTN/Airtel Mobile Money.

---

## Commands

```bash
# Development (inside Docker — recommended)
docker compose up --build          # First run / after dependency changes
docker compose up                  # Subsequent runs
docker compose logs app -f         # Follow app logs

# Development (local, outside Docker)
pnpm dev                           # Start Next.js dev server
npx prisma migrate dev --name <x>  # Create and run a migration
npx prisma migrate deploy          # Apply existing migrations
npx prisma studio                  # Open Prisma Studio GUI
npx prisma generate                # Regenerate Prisma client after schema changes

# Other
pnpm build                         # Production build
pnpm lint                          # Run ESLint
```

**pnpm path note:** If `pnpm: command not found` locally, run:
```bash
export PATH="/usr/local/bin:$PATH:/home/africanobyamugisha/.local/bin"
```

**Ports:** App → `3000`, PostgreSQL → `5434` (mapped from 5432 inside Docker).

---

## Architecture

- **Framework:** Next.js 16 App Router. Server Components by default — add `"use client"` only when needed (interactivity, hooks, browser APIs).
- **Auth:** NextAuth.js v5 beta with JWT sessions. Config at `src/lib/auth.ts`. Credentials (email/password via bcrypt) + Google OAuth. Session includes `user.id` and `user.role`.
- **Database:** PostgreSQL 16 via Prisma v6. Client singleton at `src/lib/prisma.ts`. Schema at `prisma/schema.prisma`.
- **Styling:** Tailwind CSS v4 with `@tailwindcss/postcss`. shadcn/ui (New York style) in `src/components/ui/`. Use `cn()` from `src/lib/utils.ts` to merge classes.
- **Forms:** React Hook Form + Zod validation + `@hookform/resolvers`.
- **State:** Zustand for client state; React Context for theme and sidebar config.

---

## Protected directories — NEVER modify

```
my_theme/              # Brand assets (logos, favicons) — read-only
my_reference_docs/     # Reference templates and SRS docs — read-only
```

Also never edit anything inside `src/generated/` or `.next/` (auto-generated).

---

## Key file paths

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — SessionProvider, ThemeProvider, SidebarConfigProvider |
| `src/app/globals.css` | Global Tailwind + brand colours + inlined tw-animate-css |
| `src/middleware.ts` | Route protection — defines public vs protected routes |
| `src/lib/auth.ts` | NextAuth v5 config (providers, JWT/session callbacks) |
| `src/lib/prisma.ts` | Prisma client singleton |
| `prisma/schema.prisma` | Full database schema |
| `src/components/app-sidebar.tsx` | Dashboard sidebar navigation |
| `src/components/logo.tsx` | Logo component (uses PNG files from `public/images/`) |
| `src/components/mode-toggle.tsx` | Dark/light toggle — uses custom `useTheme` hook, NOT next-themes |
| `src/hooks/use-theme.ts` | Theme hook — reads from `ThemeProviderContext` |
| `src/contexts/theme-context.ts` | Theme context definition |
| `.env.example` | All required environment variables with descriptions |

---

## Routing

| Path | Type | Notes |
|---|---|---|
| `/` | Server | Redirects to `/landing` |
| `/landing` | Public | Marketing page — all sections in `src/app/landing/components/` |
| `/sign-in` | Public | Credentials + Google sign-in |
| `/sign-up` | Public | Registration → calls `/api/auth/register` |
| `/forgot-password` | Public | Password reset (email form) |
| `/api/auth/[...nextauth]` | Public | NextAuth handler |
| `/api/auth/register` | Public | POST endpoint for new user registration |
| `/dashboard` | Protected | Overview with live Prisma stats |
| `/dashboard/tournaments` | Protected | Tournament CRUD |
| `/t/[slug]` | Public | Public tournament microsite (no auth) |

**Middleware public routes:** `/landing`, `/sign-in`, `/sign-up`, `/forgot-password`, `/api/auth/*`, `/t/*`. Everything else requires auth.

---

## Database schema (key models)

```
User           — id, email, name, password, role (ORGANIZER | TEAM_MANAGER | PLAYER | SUPER_ADMIN)
Tournament     — name, slug, sport, format (ROUND_ROBIN | SINGLE_ELIMINATION | GROUP_KNOCKOUT), status, organizerId
Group          — name, tournamentId (for group-stage tournaments)
Team           — name, shortName, tournamentId, managerId, status (PENDING | APPROVED | REJECTED)
TeamGroup      — junction table: teamId + groupId
Player         — firstName, lastName, jerseyNumber, teamId, goals, assists, cards
Fixture        — homeTeamId, awayTeamId, homeScore, awayScore, status (SCHEDULED | IN_PROGRESS | COMPLETED), tournamentId
```

Use `npx prisma migrate dev --name <description>` after any schema change.

---

## Brand colours

```css
Primary   — Deep Navy  #0A1A3F → oklch(0.21 0.069 258)   /* light mode primary */
Secondary — Tech Teal  #1ABC9C → oklch(0.69 0.12 174)    /* accents, CTAs, icons */
```

In dark mode, primary switches to teal and background becomes deep navy. See `src/app/globals.css` for full token definitions.

---

## Code conventions

- **Commits:** Conventional commits — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. Commit after every logical change.
- **Components:** Named exports, PascalCase. File names in kebab-case (`app-sidebar.tsx`).
- **Hooks:** Prefixed with `use-`, kebab-case file names.
- **Server vs Client:** Prefer Server Components. Only add `"use client"` for interactivity, event handlers, or hooks.
- **Imports:** `@/` alias for `src/`. Group: (1) React/Next, (2) third-party, (3) local.
- **Styling:** Tailwind classes only. Use `cn()` to merge. No inline styles. No CSS modules.
- **Icons:** Lucide React only.
- **No external image URLs** in UI components — use local assets or JSX placeholders.

---

## tw-animate-css note

`@import "tw-animate-css"` was replaced with inlined CSS in `globals.css` (line 3) to avoid Docker node_modules resolution failures. Do not re-add the import line.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DB_PASSWORD` | Docker | Used in docker-compose for the DB container |
| `NEXTAUTH_URL` | Yes | App URL — `http://localhost:3000` for dev |
| `NEXTAUTH_SECRET` | Yes | Random secret — `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth (leave blank to disable) |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth |

Copy `.env.example` → `.env` and fill in before starting.
