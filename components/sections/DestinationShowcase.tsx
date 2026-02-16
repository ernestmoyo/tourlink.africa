import Link from 'next/link';
import Image from 'next/image';
import { Container, SectionHeader } from '@/components/ui';
import { destinations } from '@/data/destinations';
import type { Destination } from '@/types';

const PRIMARY_SLUGS: Destination[] = ['south-africa', 'tanzania', 'zimbabwe', 'mozambique'];

export function DestinationShowcase() {
  const primaryDestinations = PRIMARY_SLUGS
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter(Boolean);

  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          eyebrow="Explore"
          heading="Discover Southern & East Africa"
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {primaryDestinations.map((destination) => {
            if (!destination) return null;
            return (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group relative block rounded-2xl overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={destination.heroImage}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay — darkens on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/80" />
                </div>

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-serif text-2xl">{destination.name}</h3>
                  <p className="text-white/70 text-sm mt-1 line-clamp-1">
                    {destination.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1 text-magenta-light text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                    Explore
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
            );
          })}
        </div>
      </Container>
    </section>
  );
}
