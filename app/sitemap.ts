import type { MetadataRoute } from 'next';
import { destinations } from '@/data/destinations';
import { packages } from '@/data/packages';

const BASE_URL = 'https://tourlink.africa';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/destinations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/packages`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/plan-your-trip`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Dynamic destination pages
  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${BASE_URL}/destinations/${dest.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic package pages
  const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${BASE_URL}/packages/${pkg.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...destinationRoutes, ...packageRoutes];
}
