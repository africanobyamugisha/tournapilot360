"use client"

import React from 'react'
import { LandingNavbar } from './components/navbar'
import { HeroSection } from './components/hero-section'
import { LogoCarousel } from './components/logo-carousel'
import { StatsSection } from './components/stats-section'
import { AboutSection } from './components/about-section'
import { FeaturesSection } from './components/features-section'
import { PricingSection } from './components/pricing-section'
import { TestimonialsSection } from './components/testimonials-section'
import { FaqSection } from './components/faq-section'
import { CTASection } from './components/cta-section'
import { ContactSection } from './components/contact-section'
import { LandingFooter } from './components/footer'

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <HeroSection />
        <LogoCarousel />
        <StatsSection />
        <AboutSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CTASection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  )
}
