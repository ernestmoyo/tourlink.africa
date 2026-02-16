import { PackageCard } from '@/components/ui/PackageCard';
import type { Package } from '@/types';

interface PackageGridProps {
  packages: Package[];
}

export function PackageGrid({ packages }: PackageGridProps) {
  if (packages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        {/* Empty state icon */}
        <svg
          className="h-16 w-16 text-savanna mb-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="M8 11h6" />
        </svg>
        <h3 className="text-xl font-serif text-charcoal mb-2">
          No packages match your filters
        </h3>
        <p className="text-slate max-w-md">
          Try adjusting your criteria or clear all filters to see our full collection
          of curated safari packages.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {packages.map((pkg) => (
        <PackageCard key={pkg.slug} pkg={pkg} />
      ))}
    </div>
  );
}
