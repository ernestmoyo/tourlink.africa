import Link from 'next/link';
import Image from 'next/image';
import { Container, SectionHeader, Badge, TripDurationBadge, PriceDisplay } from '@/components/ui';
import { packages } from '@/data/packages';

export function FeaturedPackages() {
  const featured = packages.filter((pkg) => pkg.featured).slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeader
          eyebrow="Curated Journeys"
          heading="Our Hero Packages"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((pkg) => (
            <Link
              key={pkg.slug}
              href={`/packages/${pkg.slug}`}
              className="group block rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Hero image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={pkg.heroImage}
                  alt={pkg.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Tier badge */}
                <div className="absolute top-4 left-4">
                  <Badge tier={pkg.tier} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-xl text-charcoal group-hover:text-navy transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-slate text-sm mt-2 line-clamp-2">
                  {pkg.routeSummary}
                </p>

                <div className="mt-4">
                  <TripDurationBadge days={pkg.durationDays} nights={pkg.durationNights} />
                </div>

                <div className="mt-4">
                  <PriceDisplay
                    priceFrom={pkg.priceFrom}
                    priceTo={pkg.priceTo}
                    unit={pkg.priceUnit}
                    size="sm"
                  />
                </div>

                <span className="inline-flex items-center gap-1 text-magenta font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  View Details
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
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Section CTA */}
        <div className="text-center mt-12">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-magenta font-semibold text-lg hover:gap-3 transition-all"
          >
            View All Packages
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
