"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type Testimonial = {
  name: string
  role: string
  initials: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Kagaba Samuel',
    role: 'Tournament Director, Kampala Rugby Club',
    initials: 'KS',
    quote:
      'We used to spend a whole weekend just making the fixture schedule. With TournaPilot360, the system generated all 30 fixtures in under a minute. Our referees love the live scoring feature.',
  },
  {
    name: 'Nakato Jenipher',
    role: 'Secretary, Old Budonians FC',
    initials: 'NJ',
    quote: 'Parents can follow their children\'s results on the public page without being at the pitch. That alone made it worth it for our school cup.',
  },
  {
    name: 'Muwonge David',
    role: 'Sports Coordinator, USSSA Wakiso',
    initials: 'MD',
    quote:
      'Our tournament venue at Kawempe has very poor network. TournaPilot360\'s offline mode was a lifesaver — we scored all our matches and everything synced once we got back to town.',
  },
  {
    name: 'Asiimwe Grace',
    role: 'League Organiser, Western Uganda Basketball',
    initials: 'AG',
    quote:
      'Collecting registration fees used to be the hardest part. Now teams just pay via MTN Mobile Money directly through the system. We get notified instantly and the team is registered automatically.',
  },
  {
    name: 'Okello Michael',
    role: 'Head Coach, Gulu Falcons FC',
    initials: 'OM',
    quote: 'Even our most tech-shy committee members can use it. The interface is simple and everything is in plain English. No technical training needed.',
  },
  {
    name: 'Nabuuma Patricia',
    role: 'Administrator, Kampala Corporate League',
    initials: 'NP',
    quote:
      'The WhatsApp notifications are brilliant. Players get their fixture details automatically and we\'ve stopped getting dozens of calls asking "when do we play?" The whole tournament runs smoother now.',
  },
  {
    name: 'Byamugisha Robert',
    role: 'Deputy Principal, Ntare School',
    initials: 'BR',
    quote:
      'We run the Ntare Weekend Cup every term for over 16 schools. TournaPilot360 handles the group stage and knockout rounds seamlessly. The public standings page is shared in all our school WhatsApp groups.',
  },
  {
    name: 'Atim Florence',
    role: 'Team Manager, Soroti United',
    initials: 'AF',
    quote: 'I manage three different teams in separate tournaments. TournaPilot360 keeps everything in one place — I can switch between tournaments without confusion.',
  },
  {
    name: 'Nsubuga Brian',
    role: 'Events Coordinator, Makerere University Sports',
    initials: 'NB',
    quote:
      'We run inter-hall tournaments with 24 halls competing across four sports. The multi-format support and admin roles let our different sport coordinators manage their own tournaments under one account.',
  },
  {
    name: 'Kyomugisha Ruth',
    role: 'Chairperson, Mbarara Women\'s League',
    initials: 'KR',
    quote: 'The free plan was enough to get us started. Once we saw how well it worked, we upgraded for our main season tournament. Totally worth the UGX 50,000.',
  },
  {
    name: 'Ochieng James',
    role: 'Referee Coordinator, FUFA Affiliate Club',
    initials: 'OJ',
    quote:
      'Our referees submit match reports from their phones right after the final whistle. Standings update in real-time — no waiting until Monday to know who leads the table.',
  },
  {
    name: 'Mugisha Caroline',
    role: 'Team Captain, Kampala Ladies FC',
    initials: 'MC',
    quote: 'I finally feel like our women\'s league gets the same professional treatment as the men\'s. TournaPilot360 makes us look organised and serious.',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="container mx-auto px-8 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4 border-secondary text-secondary">Testimonials</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Trusted by organisers across Uganda
          </h2>
          <p className="text-lg text-muted-foreground">
            From school USSSA cups to professional leagues — hear what tournament organisers
            across Uganda say about TournaPilot360.
          </p>
        </div>

        {/* Testimonials Masonry Grid */}
        <div className="columns-1 gap-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="mb-6 break-inside-avoid shadow-none lg:mb-4">
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="bg-secondary/10 size-12 shrink-0">
                    <AvatarFallback className="text-secondary font-semibold text-sm">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <span className="text-muted-foreground block text-sm tracking-wide">
                      {testimonial.role}
                    </span>
                  </div>
                </div>

                <blockquote className="mt-4">
                  <p className="text-sm leading-relaxed text-balance">{testimonial.quote}</p>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
