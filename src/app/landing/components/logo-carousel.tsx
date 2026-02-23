"use client"

import { Card } from '@/components/ui/card'
import {
  Trophy,
  GraduationCap,
  Shield,
  Users,
  Star,
  Zap,
  Award,
  Medal,
  Target,
  Swords,
  Flag,
  Crown,
} from 'lucide-react'

const ugandaOrgs = [
  { name: 'Ntare Lions League', icon: Trophy },
  { name: 'USSSA', icon: GraduationCap },
  { name: 'FUFA Affiliates', icon: Shield },
  { name: 'Kampala Rugby Club', icon: Users },
  { name: 'Old Budonians FC', icon: Star },
  { name: 'Vipers Youth Academy', icon: Zap },
  { name: 'Kobs Rugby Club', icon: Award },
  { name: 'Uganda Netball Fed.', icon: Medal },
  { name: 'Kibuli FC', icon: Target },
  { name: 'Corporate League UG', icon: Swords },
  { name: 'Kampala Schools Cup', icon: Flag },
  { name: 'Inter-District Games', icon: Crown },
] as const

export function LogoCarousel() {
  return (
    <section className="pb-12 sm:pb-16 lg:pb-20 pt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-8">
            Trusted by leagues and clubs across Uganda
          </p>

          {/* Logo Carousel with Fade Effect */}
          <div className="relative">
            {/* Left Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

            {/* Right Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Logo Container */}
            <div className="overflow-hidden">
              <div className="flex animate-logo-scroll space-x-8 sm:space-x-12">
                {/* First set */}
                {ugandaOrgs.map((org, index) => (
                  <Card
                    key={`first-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-16 w-48 opacity-60 hover:opacity-100 transition-opacity duration-300 border-0 shadow-none bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <org.icon className="h-6 w-6 text-secondary flex-shrink-0" />
                      <span className="text-foreground text-sm font-semibold whitespace-nowrap">
                        {org.name}
                      </span>
                    </div>
                  </Card>
                ))}
                {/* Second set for seamless loop */}
                {ugandaOrgs.map((org, index) => (
                  <Card
                    key={`second-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-16 w-48 opacity-60 hover:opacity-100 transition-opacity duration-300 border-0 shadow-none bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <org.icon className="h-6 w-6 text-secondary flex-shrink-0" />
                      <span className="text-foreground text-sm font-semibold whitespace-nowrap">
                        {org.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
