"use client"

import Link from 'next/link'
import { ArrowRight, Play, MapPin, Trophy, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DotPattern } from '@/components/dot-pattern'
import { Card, CardContent } from '@/components/ui/card'

const mockStandings = [
  { pos: 1, team: 'Ntare Lions', p: 5, w: 4, d: 1, l: 0, gd: '+9', pts: 13 },
  { pos: 2, team: 'Old Budonians', p: 5, w: 3, d: 1, l: 1, gd: '+4', pts: 10 },
  { pos: 3, team: 'Kibuli FC', p: 5, w: 2, d: 2, l: 1, gd: '+2', pts: 8 },
  { pos: 4, team: 'Kampala Corp', p: 5, w: 1, d: 1, l: 3, gd: '-4', pts: 4 },
]

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-16 sm:pt-20 pb-16"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <DotPattern className="opacity-100" size="md" fadeStyle="ellipse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement Badge */}
          <div className="mb-8 flex justify-center">
            <Badge
              variant="outline"
              className="px-4 py-2 border-secondary text-secondary"
            >
              <MapPin className="w-3 h-3 mr-2 fill-current" />
              🇺🇬 Built for Uganda&apos;s Sports Community
              <ArrowRight className="w-3 h-3 ml-2" />
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Run Your Tournament
            <span className="bg-gradient-to-r from-[#0A1A3F] to-[#1ABC9C] bg-clip-text text-transparent">
              {' '}Like a Pro
            </span>
            {' '}— Even Without Internet
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            The all-in-one tournament management system built for Uganda. Registration,
            fixtures, live scoring, and real-time standings — works offline, accepts
            mobile money, and fits your budget.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-base cursor-pointer" asChild>
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base cursor-pointer"
              asChild
            >
              <a href="#features">
                <Play className="mr-2 h-4 w-4" />
                See How It Works
              </a>
            </Button>
          </div>
        </div>

        {/* Hero Visual — Mock Tournament Standings */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] h-24 lg:h-48 bg-secondary/30 rounded-full blur-3xl" />

            <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
              <div className="p-4 sm:p-6">
                {/* Mock header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-secondary" />
                    <span className="font-semibold text-sm sm:text-base">
                      Ntare Lions Weekend Cup — Group A
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-secondary/10 text-secondary border-secondary/20">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>

                {/* Mock standings table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                        <th className="text-left pb-2 pr-2">#</th>
                        <th className="text-left pb-2 pr-4">Team</th>
                        <th className="text-center pb-2 px-2">P</th>
                        <th className="text-center pb-2 px-2">W</th>
                        <th className="text-center pb-2 px-2">D</th>
                        <th className="text-center pb-2 px-2">L</th>
                        <th className="text-center pb-2 px-2">GD</th>
                        <th className="text-center pb-2 pl-2 font-bold">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockStandings.map((row) => (
                        <tr
                          key={row.pos}
                          className={`border-b last:border-0 ${row.pos === 1 ? 'bg-secondary/5' : ''}`}
                        >
                          <td className="py-2 pr-2 font-medium text-muted-foreground">
                            {row.pos}
                          </td>
                          <td className="py-2 pr-4 font-medium">{row.team}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{row.p}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{row.w}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{row.d}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{row.l}</td>
                          <td className="py-2 px-2 text-center text-muted-foreground">{row.gd}</td>
                          <td className="py-2 pl-2 text-center font-bold text-secondary">
                            {row.pts}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mock recent result */}
                <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <Card className="bg-muted/50 border-0 w-full sm:w-auto">
                    <CardContent className="p-3 flex items-center gap-4">
                      <span className="text-sm font-medium">Ntare Lions</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">3</span>
                        <span className="text-muted-foreground text-xs">–</span>
                        <span className="text-lg font-bold">1</span>
                      </div>
                      <span className="text-sm font-medium">Old Budonians</span>
                    </CardContent>
                  </Card>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    Round 5 · FT
                  </Badge>
                </div>
              </div>

              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-card/0 to-card/80 rounded-b-xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
