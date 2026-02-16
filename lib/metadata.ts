import type { Metadata } from 'next';
import type { Package, DestinationInfo } from '@/types';

/**
 * Generate metadata for an individual package page.
 */
export function generatePackageMetadata(pkg: Package): Metadata {
  const tierLabel = pkg.tier
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('-');

  const title = `${pkg.name} — ${pkg.durationDays} Day ${tierLabel} Safari | TourLink`;

  const destinationNames = pkg.destinations
    .map((d) =>
      d
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    )
    .join(', ');

  const keywords = [
    pkg.name,
    `${tierLabel} safari`,
    `${pkg.durationDays} day safari`,
    ...pkg.destinations.map((d) => `${d.replace(/-/g, ' ')} safari`),
    ...pkg.experienceTypes,
    'TourLink',
    'African safari',
    'Southern and East Africa tours',
  ];

  return {
    title,
    description: pkg.shortDescription,
    keywords,
    openGraph: {
      title,
      description: pkg.shortDescription,
      type: 'website',
      siteName: 'TourLink',
      images: [
        {
          url: pkg.heroImage,
          width: 1200,
          height: 630,
          alt: `${pkg.name} — ${destinationNames}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pkg.shortDescription,
    },
  };
}

/**
 * Generate metadata for an individual destination page.
 */
export function generateDestinationMetadata(dest: DestinationInfo): Metadata {
  const title = `Safari in ${dest.name} | TourLink`;
  const description =
    dest.description.length > 160
      ? dest.description.slice(0, 157) + '...'
      : dest.description;

  const keywords = [
    `${dest.name} safari`,
    `${dest.name} travel`,
    ...dest.signatureExperiences,
    ...dest.keyHubs,
    'TourLink',
    'African safari',
    'Southern and East Africa tours',
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'TourLink',
      images: [
        {
          url: dest.heroImage,
          width: 1200,
          height: 630,
          alt: `Safari in ${dest.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
