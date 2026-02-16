'use client';

import Link from 'next/link';
import { packages } from '@/data/packages';
import { DESTINATION_NAMES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { TripDurationBadge } from '@/components/ui/TripDurationBadge';
import type { Package, Destination, ExperienceType } from '@/types';

interface TripRecommendationsProps {
  formData: {
    destinations: string[];
    experienceType: string;
    budgetTier: string;
    duration: string;
    groupType: string;
    preferredMonth: number | null;
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}

function scorePackage(pkg: Package, formData: TripRecommendationsProps['formData']): number {
  let score = 0;

  // Destination match: any overlap
  const hasDestinationMatch = pkg.destinations.some((d) =>
    formData.destinations.includes(d)
  );
  if (hasDestinationMatch) score += 3;

  // Budget tier match
  if (pkg.tier === formData.budgetTier) score += 2;

  // Experience type match
  if (pkg.experienceTypes.includes(formData.experienceType as ExperienceType)) score += 2;

  // Duration match
  const durationMap: Record<string, [number, number]> = {
    '5-7': [5, 7],
    '8-10': [8, 10],
    '11-14': [11, 14],
    '15+': [15, 999],
  };
  const range = durationMap[formData.duration];
  if (range && pkg.durationDays >= range[0] && pkg.durationDays <= range[1]) {
    score += 1;
  }

  // Month match
  if (formData.preferredMonth && pkg.bestMonths.includes(formData.preferredMonth)) {
    score += 1;
  }

  return score;
}

function PackageCard({ pkg }: { pkg: Package }) {
  const destinationNames = pkg.destinations
    .map((d) => DESTINATION_NAMES[d] || d)
    .join(', ');

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group block rounded-xl border border-sand bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-magenta/30"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-serif text-lg font-bold text-navy group-hover:text-magenta transition-colors">
          {pkg.name}
        </h3>
        <Badge tier={pkg.tier} className="shrink-0" />
      </div>

      <p className="text-sm text-slate mb-3">{pkg.routeSummary}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <TripDurationBadge days={pkg.durationDays} nights={pkg.durationNights} />
        <span className="text-navy font-bold">
          From {formatPrice(pkg.priceFrom)}
        </span>
        <span className="text-slate">
          {pkg.priceUnit === 'per-person' ? 'per person' : 'pp/night'}
        </span>
      </div>

      <p className="text-xs text-slate mt-2">{destinationNames}</p>
    </Link>
  );
}

export function TripRecommendations({ formData }: TripRecommendationsProps) {
  // Filter packages with ANY destination match first, then score and sort
  const destinationMatches = packages.filter((pkg) =>
    pkg.destinations.some((d) => formData.destinations.includes(d))
  );

  // If we have destination matches, score them; otherwise score all packages
  const pool = destinationMatches.length > 0 ? destinationMatches : packages;

  const scored = pool
    .map((pkg) => ({ pkg, score: scorePackage(pkg, formData) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const hasRecommendations = scored.length > 0 && scored[0].score > 0;

  return (
    <div className="space-y-8">
      {/* Success message */}
      <div className="rounded-xl bg-olive/10 border border-olive/30 p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-olive/20">
          <svg
            className="h-8 w-8 text-olive"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-navy mb-2">
          Thank You, {formData.name}!
        </h2>
        <p className="text-slate text-base max-w-lg mx-auto">
          Our team will craft your perfect itinerary within 48 hours. We&apos;ll
          send it to <span className="font-semibold text-navy">{formData.email}</span>.
        </p>
      </div>

      {/* Recommendations */}
      {hasRecommendations ? (
        <div>
          <h3 className="font-serif text-xl font-bold text-navy mb-4">
            Based on your preferences, you might love:
          </h3>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {scored.map(({ pkg }) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-sand bg-savanna/30 p-6 text-center">
          <p className="text-slate text-base">
            We&apos;ll find the perfect package for your unique requirements. Our
            travel designers will include tailored options in your proposal.
          </p>
        </div>
      )}

      {/* CTA to browse all packages */}
      <div className="text-center">
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-magenta font-semibold hover:text-magenta-dark transition-colors"
        >
          Browse all packages
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
