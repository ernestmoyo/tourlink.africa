import { packages } from '@/data/packages';
import { PackageCard } from '@/components/ui/PackageCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Destination, TierLevel } from '@/types';

interface RelatedPackagesProps {
  currentSlug: string;
  destinations: Destination[];
  tier: TierLevel;
}

export function RelatedPackages({
  currentSlug,
  destinations,
  tier,
}: RelatedPackagesProps) {
  // Find packages that share a destination or tier, excluding the current one
  const related = packages
    .filter((pkg) => {
      if (pkg.slug === currentSlug) return false;
      const sharesDestination = pkg.destinations.some((d) =>
        destinations.includes(d)
      );
      const sharesTier = pkg.tier === tier;
      return sharesDestination || sharesTier;
    })
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div>
      <SectionHeader
        eyebrow="More Adventures"
        heading="You Might Also Like"
        subtext="Explore similar packages that match your interests and travel style."
        className="mb-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((pkg) => (
          <PackageCard key={pkg.slug} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
