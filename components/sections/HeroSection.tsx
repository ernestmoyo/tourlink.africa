'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/heroes/safari-sunset.jpg"
        alt="Safari sunset across the African savanna"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-white font-serif text-5xl md:text-6xl lg:text-7xl leading-tight">
          Unforgettable Safaris Across Southern & East Africa
        </h1>
        <p className="text-white/80 text-xl mt-6 max-w-2xl mx-auto">
          Curated journeys from Cape Town to Kilimanjaro — budget adventures to ultra-luxury fly-ins
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button asChild href="/packages" size="lg">
            Explore Packages
          </Button>
          <Button
            asChild
            href="/plan-your-trip"
            variant="secondary"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-navy"
          >
            Plan Your Trip
          </Button>
        </div>
      </motion.div>

      {/* Scroll-down chevron */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          className="h-8 w-8 text-white/70"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  );
}
