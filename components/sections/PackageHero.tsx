import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { TripDurationBadge } from '@/components/ui/TripDurationBadge';
import { DifficultyIndicator } from '@/components/ui/DifficultyIndicator';
import { DESTINATION_NAMES, MONTHS } from '@/lib/constants';
import { Container } from '@/components/ui/Container';
import type { Package } from '@/types';

interface PackageHeroProps {
  pkg: Package;
}

export function PackageHero({ pkg }: PackageHeroProps) {
  const destinationNames = pkg.destinations
    .map((d) => DESTINATION_NAMES[d])
    .join(', ');

  const bestSeasonText = pkg.bestMonths
    .map((m) => MONTHS[m - 1])
    .join(', ');

  return (
    <section>
      {/* Hero image */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={pkg.heroImage}
          alt={pkg.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content overlay */}
        <Container className="relative h-full flex flex-col justify-end pb-12 lg:pb-16">
          <div className="max-w-3xl">
            <Badge tier={pkg.tier} className="mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
              {pkg.name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              {pkg.routeSummary}
            </p>
          </div>
        </Container>
      </div>

      {/* Quick facts bar */}
      <div className="bg-navy">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 text-white">
            {/* Duration */}
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-magenta-light shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-sm font-medium">
                {pkg.durationDays} Days / {pkg.durationNights} Nights
              </span>
            </div>

            {/* Divider */}
            <span className="hidden sm:block h-5 w-px bg-white/30" aria-hidden="true" />

            {/* Destinations */}
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-magenta-light shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm font-medium">{destinationNames}</span>
            </div>

            {/* Divider */}
            <span className="hidden sm:block h-5 w-px bg-white/30" aria-hidden="true" />

            {/* Group size */}
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-magenta-light shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-sm font-medium">
                {pkg.groupSizeMin}-{pkg.groupSizeMax} Guests
              </span>
            </div>

            {/* Divider */}
            {pkg.difficulty && (
              <>
                <span className="hidden sm:block h-5 w-px bg-white/30" aria-hidden="true" />
                {/* Difficulty */}
                <div className="flex items-center gap-2">
                  <DifficultyIndicator difficulty={pkg.difficulty} className="[&_span]:text-white/90" />
                </div>
              </>
            )}

            {/* Divider */}
            <span className="hidden sm:block h-5 w-px bg-white/30" aria-hidden="true" />

            {/* Best season */}
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-magenta-light shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <span className="text-sm font-medium">{bestSeasonText}</span>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
