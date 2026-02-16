import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { TripDurationBadge } from '@/components/ui/TripDurationBadge';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { DESTINATION_NAMES } from '@/lib/constants';
import type { Package } from '@/types';

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const displayHighlights = pkg.highlights.slice(0, 3);

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group block rounded-2xl bg-white shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Hero image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={pkg.heroImage}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Tier badge */}
        <div className="absolute top-3 left-3">
          <Badge tier={pkg.tier} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {/* Package name */}
        <h3 className="text-xl font-serif text-charcoal leading-tight group-hover:text-navy transition-colors duration-200">
          {pkg.name}
        </h3>

        {/* Route summary */}
        <p className="text-sm text-slate leading-relaxed line-clamp-2">
          {pkg.routeSummary}
        </p>

        {/* Destinations */}
        <p className="text-xs font-medium text-ocean">
          {pkg.destinations.map((d) => DESTINATION_NAMES[d]).join(' / ')}
        </p>

        {/* Duration */}
        <TripDurationBadge days={pkg.durationDays} nights={pkg.durationNights} />

        {/* Highlights as small tags */}
        <div className="flex flex-wrap gap-1.5">
          {displayHighlights.map((highlight) => (
            <span
              key={highlight}
              className="inline-block px-2 py-0.5 bg-sand text-xs text-charcoal rounded-md leading-snug"
            >
              {highlight.length > 40 ? `${highlight.slice(0, 40)}...` : highlight}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-1 pt-3 border-t border-savanna">
          <PriceDisplay
            priceFrom={pkg.priceFrom}
            priceTo={pkg.priceTo}
            unit={pkg.priceUnit}
            size="sm"
          />
          <span className="text-sm font-semibold text-magenta group-hover:text-magenta-dark transition-colors duration-200">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
