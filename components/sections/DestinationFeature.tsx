'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { DestinationInfo } from '@/types';

interface DestinationFeatureProps {
  destination: DestinationInfo;
  index: number;
  reversed: boolean;
}

export function DestinationFeature({ destination, index, reversed }: DestinationFeatureProps) {
  const topExperiences = destination.signatureExperiences.slice(0, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'grid gap-8 lg:gap-16 items-center',
        'grid-cols-1 lg:grid-cols-2',
        'py-16 md:py-20'
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card',
          reversed ? 'lg:order-2' : 'lg:order-1'
        )}
      >
        <Image
          src={destination.heroImage}
          alt={`${destination.name} — ${destination.tagline}`}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className={cn(reversed ? 'lg:order-1' : 'lg:order-2')}>
        <Link
          href={`/destinations/${destination.slug}`}
          className="group inline-block"
        >
          <h3 className="text-3xl md:text-4xl font-serif text-charcoal group-hover:text-navy transition-colors duration-200">
            {destination.name}
          </h3>
        </Link>

        <p className="text-lg text-magenta font-medium mt-2">
          {destination.tagline}
        </p>

        {/* Stats */}
        {(destination.marketShare || destination.growthRate) && (
          <div className="flex flex-wrap gap-4 mt-4">
            {destination.marketShare && (
              <div className="flex items-center gap-2 text-sm text-slate">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-navy/10 text-navy">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </span>
                <span>
                  <strong className="text-charcoal">Market Share:</strong> {destination.marketShare}
                </span>
              </div>
            )}
            {destination.growthRate && (
              <div className="flex items-center gap-2 text-sm text-slate">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-olive/10 text-olive">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </span>
                <span>
                  <strong className="text-charcoal">Growth:</strong> {destination.growthRate}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Description excerpt */}
        <p className="text-slate leading-relaxed mt-4 line-clamp-3">
          {destination.description.split('\n\n')[0].slice(0, 250)}...
        </p>

        {/* Signature Experiences */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal mb-3">
            Signature Experiences
          </h4>
          <ul className="space-y-2">
            {topExperiences.map((experience) => (
              <li key={experience} className="flex items-start gap-2 text-sm text-slate">
                <svg
                  className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span>{experience}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button asChild href={`/destinations/${destination.slug}`}>
            Explore {destination.name} Packages &rarr;
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
