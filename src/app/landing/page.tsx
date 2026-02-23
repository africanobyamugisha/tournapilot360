import type { Metadata } from 'next'
import { LandingPageContent } from './landing-page-content'

export const metadata: Metadata = {
  title: 'TournaPilot360 — Tournament Management System for Uganda',
  description:
    'The all-in-one sports tournament management platform built for Uganda. Registration, fixtures, live scoring, real-time standings. Works offline, accepts mobile money.',
  keywords: [
    'tournament management',
    'sports tournament',
    'Uganda',
    'fixture generation',
    'live scoring',
    'standings',
    'mobile money',
    'offline',
    'football tournament',
    'corporate league',
    'old students league',
  ],
  openGraph: {
    title: 'TournaPilot360 — Run Your Tournament Like a Pro',
    description:
      "Professional tournament management for Uganda's grassroots sports ecosystem. Free to start.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TournaPilot360 — Run Your Tournament Like a Pro',
    description:
      "Professional tournament management for Uganda's grassroots sports ecosystem.",
  },
}

export default function LandingPage() {
  return <LandingPageContent />
}
