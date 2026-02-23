"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CardDecorator } from '@/components/ui/card-decorator'
import { WifiOff, Smartphone, Wallet, Headphones } from 'lucide-react'

const values = [
  {
    icon: WifiOff,
    title: 'Works Offline',
    description: 'Manage fixtures, record scores, and update standings even without an internet connection. Data syncs automatically when you reconnect.'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Designed for Uganda\'s mobile-first reality. Works seamlessly on Android and low-end devices common at grassroots venues.'
  },
  {
    icon: Wallet,
    title: 'Mobile Money Ready',
    description: 'Accept tournament fees via MTN Mobile Money and Airtel Money. No bank account needed — pay and register from your phone.'
  },
  {
    icon: Headphones,
    title: 'Local Support',
    description: 'Our team is based in Uganda. Get support in English or Luganda via WhatsApp, phone, or in-person across major Ugandan cities.'
  }
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-4 border-secondary text-secondary">
            About TournaPilot360
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Built for Uganda&apos;s sports community
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We understand the challenges of running tournaments in Uganda — unreliable internet,
            cash-based payments, and tight budgets. TournaPilot360 was built from the ground up
            to solve these real problems for local leagues, schools, and clubs.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 mb-12">
          {values.map((value, index) => (
            <Card key={index} className='group shadow-xs py-2'>
              <CardContent className='p-8'>
                <div className='flex flex-col items-center text-center'>
                  <CardDecorator>
                    <value.icon className='h-6 w-6' aria-hidden />
                  </CardDecorator>
                  <h3 className='mt-6 font-medium text-balance'>{value.title}</h3>
                  <p className='text-muted-foreground mt-3 text-sm'>{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-muted-foreground">🇺🇬 Proudly built for Uganda&apos;s sports community</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="cursor-pointer" asChild>
              <Link href="/sign-up">
                Create Your First Tournament
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="cursor-pointer" asChild>
              <a href="#contact">
                Talk to Our Team
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
