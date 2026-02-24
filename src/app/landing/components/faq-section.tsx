"use client"

import { CircleHelp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

type FaqItem = {
  value: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    value: 'item-1',
    question: 'Does TournaPilot360 work without internet?',
    answer:
      'Offline mode is on our near-term roadmap. The platform is built mobile-first and designed for low-bandwidth environments — you can manage your entire tournament from a basic smartphone browser. Full offline support with local storage and background sync is coming soon, specifically for Uganda\'s tournament venues where network coverage can be unreliable.',
  },
  {
    value: 'item-2',
    question: 'How does mobile money payment work?',
    answer:
      'Teams pay their registration fees directly via MTN Mobile Money or Airtel Money using a payment prompt sent to their phone. No bank account or debit card is needed. You receive instant confirmation and the team is automatically marked as registered. You can also manually record cash payments if needed.',
  },
  {
    value: 'item-3',
    question: 'Can I use it for school USSSA tournaments?',
    answer:
      'Absolutely. TournaPilot360 is used by many USSSA-affiliated schools across Uganda for inter-school and inter-district competitions. The free Starter plan supports up to 8 teams, which covers most school cup formats. For larger USSSA-qualifying tournaments, the Standard plan (UGX 50,000) handles up to 32 teams with group stages and knockout rounds.',
  },
  {
    value: 'item-4',
    question: 'How many teams can I register per tournament?',
    answer:
      'The free Starter plan supports up to 8 teams. The Standard plan (UGX 50,000 per tournament) supports up to 32 teams. The Pro plan (UGX 120,000 per tournament) supports unlimited teams. All plans include automatic fixture generation regardless of team count.',
  },
  {
    value: 'item-5',
    question: 'What sports and tournament formats are supported?',
    answer:
      'TournaPilot360 supports football, basketball, volleyball, netball, rugby, cricket, athletics, and other sports. Tournament formats include round-robin (league), single elimination (knockout), and group stages with knockout. You can configure points systems and tiebreaker rules to match your specific competition structure. Additional formats like double elimination and Swiss system are on our roadmap.',
  },
  {
    value: 'item-6',
    question: 'How do teams and players get their match schedules?',
    answer:
      'Every tournament gets a public shareable link (e.g. tournapilot360.vercel.app/t/your-tournament) that anyone can view to see fixtures, live scores, and standings — no app download or login required. WhatsApp and SMS notifications for automatic schedule delivery are coming soon.',
  },
  {
    value: 'item-7',
    question: 'Is my tournament data safe and private?',
    answer:
      'Yes. All data is stored securely on cloud servers. You control what is public (standings, fixtures) and what is private (player contact details, payment records). We do not share or sell your data. You can export all your tournament data at any time.',
  },
  {
    value: 'item-8',
    question: 'Can multiple people manage the same tournament?',
    answer:
      'Yes — the Pro plan includes multi-admin access. You can assign roles to co-organisers, referees, and team managers. Referees can record scores from their phones, team managers can update their squad, and you retain full control as the tournament owner.',
  },
]

const FaqSection = () => {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4 border-secondary text-secondary">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about running your tournament with TournaPilot360.
            Still have questions? Our team is here to help.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          <div className='bg-transparent'>
            <div className='p-0'>
              <Accordion type='single' collapsible className='space-y-5'>
                {faqItems.map(item => (
                  <AccordionItem key={item.value} value={item.value} className='rounded-md !border bg-transparent'>
                    <AccordionTrigger className='cursor-pointer items-center gap-4 rounded-none bg-transparent py-2 ps-3 pe-4 hover:no-underline data-[state=open]:border-b'>
                      <div className='flex items-center gap-4'>
                        <div className='bg-secondary/10 text-secondary flex size-9 shrink-0 items-center justify-center rounded-full'>
                          <CircleHelp className='size-5' />
                        </div>
                        <span className='text-start font-semibold'>{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='p-4 bg-transparent'>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions? We&apos;re here to help via WhatsApp or email.
            </p>
            <Button className='cursor-pointer' asChild>
              <a href="#contact">
                Contact Our Team
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export { FaqSection }
