import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { packages } from '@/data/packages';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { PackageHero } from '@/components/sections/PackageHero';
import { ItineraryAccordion } from '@/components/sections/ItineraryAccordion';
import { IncludesExcludes } from '@/components/sections/IncludesExcludes';
import { PricingTable } from '@/components/sections/PricingTable';
import { RelatedPackages } from '@/components/sections/RelatedPackages';
import { DESTINATION_NAMES } from '@/lib/constants';

// Generate static paths for all packages
export function generateStaticParams() {
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

// Generate dynamic metadata for each package
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);

  if (!pkg) {
    return {
      title: 'Package Not Found',
    };
  }

  const destinations = pkg.destinations
    .map((d) => DESTINATION_NAMES[d])
    .join(', ');

  return {
    title: pkg.name,
    description: pkg.shortDescription,
    openGraph: {
      title: `${pkg.name} | TourLink`,
      description: pkg.shortDescription,
      images: [
        {
          url: pkg.heroImage,
          width: 1200,
          height: 630,
          alt: pkg.name,
        },
      ],
    },
    keywords: [
      pkg.name,
      ...pkg.destinations.map((d) => DESTINATION_NAMES[d]),
      'safari',
      'Africa',
      'TourLink',
    ],
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);

  if (!pkg) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <PackageHero pkg={pkg} />

      {/* Overview */}
      <section className="py-12 lg:py-16 bg-white">
        <Container variant="narrow">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-6">
            Overview
          </h2>
          <div className="prose prose-lg max-w-none">
            {pkg.fullDescription.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-charcoal leading-relaxed mb-4 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Highlights */}
          {pkg.highlights.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-charcoal mb-4">
                Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm text-charcoal"
                  >
                    <svg
                      className="h-5 w-5 text-gold shrink-0 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      {/* Itinerary */}
      {pkg.itinerary.length > 0 && (
        <section className="py-12 lg:py-16 bg-sand">
          <Container variant="narrow">
            <ItineraryAccordion itinerary={pkg.itinerary} />
          </Container>
        </section>
      )}

      {/* Includes / Excludes */}
      <section className="py-12 lg:py-16 bg-white">
        <Container variant="narrow">
          <IncludesExcludes included={pkg.included} excluded={pkg.excluded} />
        </Container>
      </section>

      {/* Pricing */}
      <section className="py-12 lg:py-16 bg-sand">
        <Container variant="narrow">
          <PricingTable pkg={pkg} />
        </Container>
      </section>

      {/* Related packages */}
      <section className="py-12 lg:py-16 bg-white">
        <Container>
          <RelatedPackages
            currentSlug={pkg.slug}
            destinations={pkg.destinations}
            tier={pkg.tier}
          />
        </Container>
      </section>
    </>
  );
}
