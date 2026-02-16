import type { Package } from '@/types';
import { siteConfig } from '@/data/site';

/**
 * Generate TravelAgency JSON-LD schema for TourLink.
 * Place the returned object in a <script type="application/ld+json"> tag.
 */
export function generateTravelAgencySchema() {
  const hq = siteConfig.offices.find((o) => o.isHQ) ?? siteConfig.offices[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: hq.phones[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: hq.address,
      addressLocality: hq.city,
      addressCountry: hq.country,
    },
    openingHours: siteConfig.operatingHours,
    sameAs: [
      siteConfig.socialLinks.facebook,
      siteConfig.socialLinks.instagram,
      siteConfig.socialLinks.twitter,
      siteConfig.socialLinks.linkedin,
    ].filter(Boolean),
    areaServed: [
      { '@type': 'Country', name: 'South Africa' },
      { '@type': 'Country', name: 'Tanzania' },
      { '@type': 'Country', name: 'Zimbabwe' },
      { '@type': 'Country', name: 'Mozambique' },
      { '@type': 'Country', name: 'Namibia' },
      { '@type': 'Country', name: 'Botswana' },
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Country', name: 'Zambia' },
    ],
    priceRange: '$$-$$$$',
  };
}

/**
 * Generate TouristTrip JSON-LD schema for a specific package.
 * Place the returned object in a <script type="application/ld+json"> tag.
 */
export function generateTouristTripSchema(pkg: Package) {
  const destinationNames = pkg.destinations.map((d) =>
    d
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );

  const tierLabel = pkg.tier
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('-');

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.name,
    description: pkg.shortDescription,
    url: `${siteConfig.url}/packages/${pkg.slug}`,
    touristType: pkg.targetSegments,
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.itinerary.length,
      itemListElement: pkg.itinerary.map((day) => ({
        '@type': 'ListItem',
        position: day.dayNumber,
        name: day.title,
        description: day.description,
      })),
    },
    offers: {
      '@type': 'Offer',
      price: pkg.priceFrom,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: pkg.priceFrom,
        priceCurrency: 'USD',
        unitText: pkg.priceUnit === 'per-person' ? 'per person' : 'per person per night',
      },
    },
    provider: {
      '@type': 'TravelAgency',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    touristDestination: destinationNames.map((name) => ({
      '@type': 'TouristDestination',
      name,
    })),
    additionalType: `${tierLabel} Safari`,
    duration: `P${pkg.durationDays}D`,
    image: pkg.heroImage,
  };
}
