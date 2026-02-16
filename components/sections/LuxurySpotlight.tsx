'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Container, SectionHeader } from '@/components/ui';
import { properties } from '@/data/properties';
import { formatPrice } from '@/lib/utils';

export function LuxurySpotlight() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 'left' | 'right') {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  }

  return (
    <section className="py-20">
      <Container>
        <SectionHeader
          eyebrow="New Openings"
          heading="Luxury Properties 2024-2026"
          className="mb-12"
        />

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scrollBy('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-charcoal hover:text-navy cursor-pointer"
            aria-label="Scroll left"
          >
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scrollBy('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-charcoal hover:text-navy cursor-pointer"
            aria-label="Scroll right"
          >
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
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {properties.map((property, index) => (
              <div
                key={`${property.name}-${index}`}
                className="flex-shrink-0 w-[300px] md:w-[340px] snap-start rounded-2xl overflow-hidden bg-white shadow-card"
              >
                {/* Image */}
                {property.image && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.name}
                      fill
                      sizes="340px"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif text-lg text-charcoal">{property.name}</h3>
                  <p className="text-slate text-sm mt-1">{property.location}</p>
                  <p className="text-magenta text-xs font-semibold uppercase tracking-wider mt-2">
                    Opening {property.openingDate}
                  </p>

                  {property.rateFrom && (
                    <p className="text-navy font-bold mt-2">
                      From {formatPrice(property.rateFrom)}
                      {property.rateTo && (
                        <span className="text-slate font-normal"> &ndash; {formatPrice(property.rateTo)}</span>
                      )}
                      {property.rateUnit && (
                        <span className="text-slate font-normal text-xs block">{property.rateUnit}</span>
                      )}
                    </p>
                  )}

                  <p className="text-slate text-sm mt-3 line-clamp-3">{property.edge}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
