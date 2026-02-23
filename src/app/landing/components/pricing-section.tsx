"use client"

import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Starter',
    description: 'Try TournaPilot360 free — perfect for small clubs and school tournaments',
    price: 'Free',
    priceNote: 'No credit card required',
    features: [
      'Up to 8 teams',
      '1 active tournament at a time',
      'Fixture generation',
      'Basic standings table',
      'Public tournament page',
      'Community support',
    ],
    cta: 'Get Started Free',
    ctaHref: '/sign-up',
    popular: false,
  },
  {
    name: 'Standard',
    description: 'For active leagues and recurring tournaments',
    price: 'UGX 50,000',
    priceNote: 'Per tournament',
    features: [
      'Up to 32 teams',
      'Unlimited active tournaments',
      'Live scoring & real-time standings',
      'MTN & Airtel Mobile Money payments',
      'WhatsApp & SMS notifications',
      'Offline mode with auto-sync',
      'Round-robin & group stages',
      'PDF results export',
    ],
    cta: 'Create Tournament',
    ctaHref: '/sign-up',
    popular: true,
    includesPrevious: 'Everything in Starter, plus',
  },
  {
    name: 'Pro',
    description: 'For large competitions and professional organisers',
    price: 'UGX 120,000',
    priceNote: 'Per tournament',
    features: [
      'Unlimited teams',
      'Knockout + group stage combos',
      'Custom tournament branding',
      'Multi-admin access',
      'Priority WhatsApp support',
      'Early access to new features',
    ],
    cta: 'Go Pro',
    ctaHref: '/sign-up',
    popular: false,
    includesPrevious: 'Everything in Standard, plus',
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <Badge variant="outline" className="mb-4 border-secondary text-secondary">Pricing</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Pay per tournament — no subscriptions
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, then pay only when you create a tournament. No monthly fees,
            no hidden costs — just simple UGX pricing that fits your budget.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border">
            <div className="grid lg:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`p-8 grid grid-rows-subgrid row-span-4 gap-6 ${
                    plan.popular
                      ? 'my-2 mx-4 rounded-xl bg-card border-transparent shadow-xl ring-1 ring-foreground/10 backdrop-blur'
                      : ''
                  }`}
                >
                  {/* Plan Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-medium tracking-tight">{plan.name}</span>
                      {plan.popular && (
                        <Badge className="text-xs bg-secondary/10 text-secondary border-secondary/20">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground text-balance text-sm">{plan.description}</div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <div className="text-4xl font-bold mb-1">{plan.price}</div>
                    <div className="text-muted-foreground text-sm">{plan.priceNote}</div>
                  </div>

                  {/* CTA Button */}
                  <div>
                    <Button
                      className={`w-full cursor-pointer my-2 ${
                        plan.popular
                          ? 'shadow-md border-[0.5px] border-white/25 shadow-black/20 bg-primary ring-1 ring-primary/15 text-primary-foreground hover:bg-primary/90'
                          : 'shadow-sm shadow-black/15 border border-transparent bg-background ring-1 ring-foreground/10 hover:bg-muted/50'
                      }`}
                      variant={plan.popular ? 'default' : 'secondary'}
                      asChild
                    >
                      <Link href={plan.ctaHref}>{plan.cta}</Link>
                    </Button>
                  </div>

                  {/* Features */}
                  <div>
                    <ul role="list" className="space-y-3 text-sm">
                      {plan.includesPrevious && (
                        <li className="flex items-center gap-3 font-medium">
                          {plan.includesPrevious}:
                        </li>
                      )}
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <Check className="text-secondary size-4 flex-shrink-0" strokeWidth={2.5} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise Note */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Running a large league or need a custom setup?{' '}
            <Button variant="link" className="p-0 h-auto cursor-pointer text-secondary" asChild>
              <a href="#contact">
                Talk to our team
              </a>
            </Button>
          </p>
        </div>
      </div>
    </section>
  )
}
