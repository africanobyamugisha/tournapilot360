# TournaPilot360

**Uganda's all-in-one sports tournament management system.**

Run your league, school cup, or corporate tournament like a professional — offline, on mobile, and on budget.

---

## What it does

TournaPilot360 handles every stage of a tournament:

- **Registration** — teams register online or offline, pay via MTN/Airtel Mobile Money
- **Fixture generation** — round-robin, knockout, group stages auto-generated in seconds
- **Live scoring** — referees score matches from any device, on or off the internet
- **Real-time standings** — auto-updating tables visible to everyone via a public share link
- **Offline mode** — full functionality without internet; data syncs when reconnected
- **Notifications** — WhatsApp and SMS alerts sent to teams automatically

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4, shadcn/ui (New York) |
| Database | PostgreSQL 16 via Prisma v6 |
| Auth | NextAuth.js v5 (credentials + Google OAuth) |
| Runtime | Node.js 20, pnpm |
| Infra | Docker Compose (app + db) |

---

## Getting started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- or Node.js 20+, pnpm, and a PostgreSQL instance

### 1. Clone and configure environment

```bash
git clone <repo-url>
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

# Google OAuth (optional — leave blank to disable Google sign-in)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 2. Start with Docker (recommended)

```bash
docker compose up --build
```

This starts:
- **PostgreSQL 16** on port `5434`
- **Next.js app** on port `3000` (with `pnpm install` + `prisma migrate deploy` on startup)

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the landing page.

### 3. Start locally (without Docker)

```bash
pnpm install
npx prisma migrate deploy
pnpm dev
```

Requires a running PostgreSQL instance with the connection string in `.env`.

---

## Project structure

```
src/
├── app/
│   ├── (auth)/              # Sign-in, sign-up, forgot-password pages
│   ├── api/
│   │   └── auth/            # NextAuth handlers + /register endpoint
│   ├── dashboard/           # Authenticated dashboard (sidebar layout)
│   └── landing/             # Public landing page
│       └── components/      # Hero, Features, Pricing, FAQ, etc.
├── components/
│   ├── ui/                  # shadcn/ui component library
│   ├── app-sidebar.tsx      # Dashboard navigation sidebar
│   ├── logo.tsx             # TournaPilot360 logo component
│   ├── mode-toggle.tsx      # Light/dark mode toggle
│   └── session-provider.tsx # NextAuth SessionProvider wrapper
├── contexts/                # Theme and sidebar config contexts
├── hooks/                   # use-theme, use-mobile, etc.
├── lib/
│   ├── auth.ts              # NextAuth v5 config (providers, callbacks)
│   ├── prisma.ts            # Prisma client singleton
│   └── fonts.ts             # Inter font config
├── middleware.ts             # Route protection (redirects unauthenticated users)
└── types/
    └── next-auth.d.ts       # Session type extensions (id, role)

prisma/
└── schema.prisma            # Database schema (User, Tournament, Team, Player, Fixture…)
```

---

## Database schema

Key models:

| Model | Description |
|---|---|
| `User` | Organizer accounts (email/password or Google) |
| `Tournament` | Competitions with format, sport type, and status |
| `Group` | Groups within a tournament (e.g. Group A, Group B) |
| `Team` | Registered teams with squad details |
| `Player` | Individual player profiles linked to teams |
| `Fixture` | Scheduled matches with scores and status |

---

## Routes

| Path | Description |
|---|---|
| `/` | Redirects to `/landing` |
| `/landing` | Public marketing page |
| `/sign-in` | Sign in with email/password or Google |
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

## Development commands

```bash
# Start dev server
pnpm dev

# Run database migrations
npx prisma migrate dev --name <migration-name>

# Open Prisma Studio (database GUI)
npx prisma studio

# Rebuild Docker containers (after dependency changes)
docker compose down && docker compose up --build

# Lint
pnpm lint
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DB_PASSWORD` | Docker only | Used by docker-compose for the DB container |
| `NEXTAUTH_URL` | Yes | Full URL of the app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Random secret — generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `NEXT_PUBLIC_APP_NAME` | No | App name for display (default: TournaPilot360) |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL |

---

## Contributing

This project follows conventional commits:

```
feat:     new feature
fix:      bug fix
chore:    dependency or config change
refactor: code restructure without behaviour change
docs:     documentation only
```

---

## License

Private — TournaPilot360 © 2026. All rights reserved.
