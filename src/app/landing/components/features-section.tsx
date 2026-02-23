"use client"

import Link from 'next/link'
import {
  CalendarDays,
  Zap,
  Globe,
  LayoutList,
  WifiOff,
  Wallet,
  Bell,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const mainFeatures = [
  {
    icon: CalendarDays,
    title: 'Registration & Scheduling',
    description: 'Teams register online or offline. Fixtures auto-generated in seconds.'
  },
  {
    icon: Zap,
    title: 'Live Scoring',
    description: 'Record scores in real-time from any device, on or off the internet.'
  },
  {
    icon: Globe,
    title: 'Public Standings',
    description: 'Shareable tournament page with live-updating standings for fans.'
  },
  {
    icon: LayoutList,
    title: 'Multi-Format Support',
    description: 'Round-robin, knockout, group stages — all formats supported out of the box.'
  }
]

const secondaryFeatures = [
  {
    icon: WifiOff,
    title: 'Offline Mode',
    description: 'Full functionality without internet. Data syncs automatically when reconnected.'
  },
  {
    icon: Wallet,
    title: 'Mobile Money',
    description: 'MTN & Airtel payments built in. No bank account or card required.'
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'WhatsApp and SMS alerts for match schedules, results, and changes.'
  },
  {
    icon: ShieldCheck,
    title: 'Admin Controls',
    description: 'Role-based access — organizers, referees, and team managers in one system.'
  }
]

// Mock fixture schedule UI
function MockFixtureCard() {
  const fixtures = [
    { time: '10:00', home: 'Ntare Lions', away: 'Kibuli FC', status: 'FT', score: '2–1' },
    { time: '12:00', home: 'Old Budonians', away: 'Kampala Corp', status: 'Live', score: '1–0' },
    { time: '14:00', home: 'Vipers Youth', away: 'Kobs RFC', status: 'Upcoming', score: null },
  ]

  return (
    <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-20 bg-secondary/20 rounded-full blur-3xl" />
      <div className="relative p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">Round 3 — Fixture Schedule</span>
          <Badge variant="outline" className="text-xs">Sat 15 Mar</Badge>
        </div>
        {fixtures.map((f, i) => (
          <Card key={i} className="bg-muted/40 border-0">
            <CardContent className="p-3 flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10 shrink-0">{f.time}</span>
              <div className="flex-1 flex items-center justify-between gap-2 text-sm">
                <span className="font-medium truncate">{f.home}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {f.score ? (
                    <span className="font-bold text-base tabular-nums">{f.score}</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">vs</span>
                  )}
                </div>
                <span className="font-medium truncate text-right">{f.away}</span>
              </div>
              <Badge
                variant={f.status === 'Live' ? 'secondary' : 'outline'}
                className={`text-xs shrink-0 ${f.status === 'Live' ? 'bg-secondary/10 text-secondary border-secondary/20' : ''}`}
              >
                {f.status === 'Live' && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-secondary inline-block animate-pulse" />}
                {f.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-b from-card/0 to-card/80 rounded-b-xl pointer-events-none" />
    </div>
  )
}

// Mock offline/sync UI
function MockOfflineCard() {
  const steps = [
    { label: 'Match scored offline', done: true },
    { label: 'Standings updated locally', done: true },
    { label: 'Syncing to cloud…', done: false, active: true },
    { label: 'Notifications sent via SMS', done: false },
  ]

  return (
    <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-20 bg-secondary/20 rounded-full blur-3xl" />
      <div className="relative p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-sm">Offline Sync Status</span>
          <Badge variant="outline" className="text-xs gap-1">
            <WifiOff className="h-3 w-3" /> Back Online
          </Badge>
        </div>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              {step.done ? (
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
              ) : step.active ? (
                <Clock className="h-5 w-5 text-secondary animate-spin shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm ${step.done ? 'text-foreground' : step.active ? 'text-secondary font-medium' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            3 matches scored offline · 2 standings updated · Syncing now
          </p>
        </div>
      </div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4 border-secondary text-secondary">Platform Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to run a tournament
          </h2>
          <p className="text-lg text-muted-foreground">
            From registration to final whistle — TournaPilot360 handles fixtures, scoring,
            standings, and payments so you can focus on the game.
          </p>
        </div>

        {/* First Feature Section */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16 mb-24">
          {/* Left: Mock UI */}
          <MockFixtureCard />

          {/* Right Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Run your tournament end-to-end
              </h3>
              <p className="text-muted-foreground text-base text-pretty">
                Register teams, auto-generate fixtures, score matches live, and publish
                standings — all from one dashboard designed for Ugandan tournament organizers.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {mainFeatures.map((feature, index) => (
                <li key={index} className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors">
                  <div className="mt-0.5 flex shrink-0 items-center justify-center">
                    <feature.icon className="size-5 text-secondary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
              <Button size="lg" className="cursor-pointer" asChild>
                <Link href="/sign-up" className='flex items-center'>
                  Start for Free
                  <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer" asChild>
                <a href="#pricing">
                  View Pricing
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Second Feature Section - Flipped Layout */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
          {/* Left Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Built for Uganda&apos;s real conditions
              </h3>
              <p className="text-muted-foreground text-base text-pretty">
                Sporadic internet, cash payments, and mobile-only users — we&apos;ve built
                TournaPilot360 specifically for the challenges tournament organizers face across Uganda.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {secondaryFeatures.map((feature, index) => (
                <li key={index} className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors">
                  <div className="mt-0.5 flex shrink-0 items-center justify-center">
                    <feature.icon className="size-5 text-secondary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
              <Button size="lg" className="cursor-pointer" asChild>
                <a href="#contact" className='flex items-center'>
                  Talk to Our Team
                  <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer" asChild>
                <a href="#faq">
                  Read FAQs
                </a>
              </Button>
            </div>
          </div>

          {/* Right: Mock UI */}
          <div className="order-1 lg:order-2">
            <MockOfflineCard />
          </div>
        </div>
      </div>
    </section>
  )
}
