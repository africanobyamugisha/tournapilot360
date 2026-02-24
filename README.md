# TournaPilot360

**Purpose-built for Uganda: manage grassroots tournaments end-to-end — registration, fixtures, live scoring, and public standings.**

Uganda has thousands of grassroots tournaments each year — old students' leagues like the Ntare Lions League, corporate inter-company cups, school competitions, and community weekend events — yet organizers still rely on WhatsApp groups, Excel sheets, and paper forms. TournaPilot360 gives every grassroots organizer the same operational power that professional leagues have, in a package designed for Uganda's reality: offline-capable, mobile-first, and affordable.

**Live demo:** [tournapilot360.vercel.app](https://tournapilot360.vercel.app)
**Demo login:** `demo@tournapilot.ug` / `password123`
**Public tournament:** [Kampala Schools Cup 2026](https://tournapilot360.vercel.app/t/kampala-schools-cup-2026)

---

## Screenshots

### Dashboard Overview
![Dashboard](public/images/dashboard.png)

### Live Standings
![Standings](public/images/standings.png)

### Public Tournament Page
![Public Tournament](public/images/public-tournament.png)

### Landing Page
![Landing Page](public/images/landing-page.png)

---

## The Problem

Organizers of grassroots tournaments in Uganda face:

- **Registration chaos** — team sign-ups via scattered phone calls, WhatsApp messages, and paper forms
- **Fixture generation pain** — hours of manual work in Excel, resulting in conflicts and disputes
- **No central record of results** — match outcomes announced verbally with no authoritative source of truth
- **Zero fan engagement tools** — no digital channel for teams, fans, and sponsors to follow schedules and standings

International platforms (Tournify, Challonge, LeagueApps) fail here because they're priced in USD/EUR, require reliable internet, and lack local context.

---

## What TournaPilot360 Does

| Feature | Description |
|---|---|
| **Team & Player Registration** | Online registration with roster management and approval workflows |
| **Automatic Fixture Generation** | Round-robin, knockout, and group-stage formats generated in seconds |
| **Live Scoring** | Score matches from any device — standings update automatically |
| **Real-time Standings** | Auto-calculating league tables with configurable point systems |
| **Public Tournament Microsite** | Shareable `/t/[slug]` page for fans — no login required |
| **Multi-sport Support** | Football, basketball, volleyball, netball, rugby, cricket, athletics |
| **Offline-first Design** | Core functions work without internet; data syncs when reconnected |

---

## Target Users

| Segment | Example |
|---|---|
| Old Students' Leagues | Ntare Lions League, Old Budonians, Namilyango Old Boys |
| Corporate Tournaments | Bank of Uganda Inter-Departmental League, Stanbic Corporate Cup |
| School Competitions | USSSA regionals, inter-house competitions, university inter-hall games |
| Community Events | Church tournaments, local council weekend cups, charity matches |
| Sports Federations | FUFA district associations, regional basketball/rugby events |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4, shadcn/ui (New York) |
| Database | PostgreSQL 16 via Prisma v6 |
| Auth | NextAuth.js v5 (credentials) |
| Runtime | Node.js 20, pnpm |
| Infra | Docker Compose (dev), Vercel + Prisma Accelerate (prod) |

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- or Node.js 20+, pnpm, and a PostgreSQL instance

### 1. Clone and configure environment

```bash
git clone https://github.com/africanobyamugisha/tournapilot360.git
cd tournapilot360
cp .env.example .env
```

Edit `.env` and fill in the required values:

```env
# Database (auto-configured in Docker — only change if running locally)
DATABASE_URL="postgresql://tournapilot:tournapilot_dev_2026@localhost:5434/tournapilot360"
DB_PASSWORD="tournapilot_dev_2026"

# NextAuth — generate a secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

### 2. Start with Docker (recommended)

```bash
docker compose up --build
```

This starts:
- **PostgreSQL 16** on port `5434`
- **Next.js app** on port `3000` (with `pnpm install` + `prisma migrate deploy` on startup)

### 3. Seed demo data

```bash
pnpm seed
```

Creates a demo organizer account (`demo@tournapilot.ug` / `password123`) and a sample tournament with teams, players, and fixtures.

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the landing page.

### 4. Start locally (without Docker)

```bash
pnpm install
npx prisma migrate deploy
pnpm seed
pnpm dev
```

Requires a running PostgreSQL instance with the connection string in `.env`.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Sign-in, sign-up, forgot-password pages
│   ├── api/
│   │   └── auth/            # NextAuth handlers + /register endpoint
│   ├── dashboard/           # Authenticated dashboard (sidebar layout)
│   ├── landing/             # Public landing page
│   │   └── components/      # Hero, Features, Pricing, FAQ, etc.
│   └── t/[slug]/            # Public tournament microsite
├── components/
│   ├── ui/                  # shadcn/ui component library
│   ├── app-sidebar.tsx      # Dashboard navigation sidebar
│   ├── logo.tsx             # TournaPilot360 logo component
│   └── mode-toggle.tsx      # Light/dark mode toggle
├── contexts/                # Theme and sidebar config contexts
├── hooks/                   # use-theme, use-mobile, etc.
├── lib/
│   ├── auth.ts              # NextAuth v5 config (providers, callbacks)
│   ├── prisma.ts            # Prisma client singleton
│   └── standings.ts         # Standings calculation engine
├── middleware.ts             # Route protection
└── types/
    └── next-auth.d.ts       # Session type extensions (id, role)

prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Demo data seeder
```

---

## Database Schema

| Model | Description |
|---|---|
| `User` | Organizer accounts with role-based access (Organizer, Team Manager, Player, Super Admin) |
| `Tournament` | Competitions with format, sport type, status, and configurable point systems |
| `Group` | Groups within a tournament (e.g. Group A, Group B) |
| `Team` | Registered teams with approval workflow (Pending, Approved, Rejected) |
| `Player` | Individual player profiles with jersey number, position, and stats |
| `Fixture` | Scheduled matches with scores, rounds, and status tracking |

---

## Routes

| Path | Description |
|---|---|
| `/` | Redirects to `/landing` |
| `/landing` | Public marketing page |
| `/sign-in` | Sign in with email/password |
| `/sign-up` | Create a new account |
| `/forgot-password` | Request a password reset |
| `/dashboard` | Overview — stats and recent tournaments |
| `/dashboard/tournaments` | List all your tournaments |
| `/dashboard/tournaments/new` | Create a new tournament |
| `/dashboard/tournaments/[id]` | Manage a specific tournament |
| `/dashboard/teams` | All teams across tournaments |
| `/dashboard/players` | All registered players |
| `/dashboard/fixtures` | Fixture schedule and scoring |
| `/dashboard/standings` | Live standings tables |
| `/t/[slug]` | Public tournament microsite (no login required) |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DB_PASSWORD` | Docker only | Used by docker-compose for the DB container |
| `NEXTAUTH_URL` | Yes | Full URL of the app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Random secret — generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_NAME` | No | App name for display (default: TournaPilot360) |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL |

---

## Author

**Africano Byamugisha** — BluePrint Consortium Africa / RDM Africa
africanobyamugisha@gmail.com | +256 706 107 619

---

## License

Private — TournaPilot360 © 2026. All rights reserved.
