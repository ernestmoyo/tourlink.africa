'use client';

import { packages } from '@/data/packages';
import { usePackageFilters } from '@/hooks/usePackageFilters';
import { PackageFilterBar } from '@/components/sections/PackageFilterBar';
import { PackageGrid } from '@/components/sections/PackageGrid';
import { Container } from '@/components/ui/Container';

export default function PackagesPage() {
  const { filteredPackages, filters, setFilter, clearFilters, activeFilterCount } =
    usePackageFilters(packages);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 lg:py-28">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-widest font-semibold text-magenta-light mb-4">
              Curated Collection
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
              Explore Our Packages
            </h1>
            <p className="text-lg text-white/80 mt-6 max-w-2xl mx-auto leading-relaxed">
              From budget overland adventures to ultra-luxury fly-in safaris, discover
              handcrafted journeys across Southern and East Africa. Every package is
              vetted by our on-the-ground team and backed by trusted local partners.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter bar */}
      <PackageFilterBar
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Package grid */}
      <section className="bg-sand py-12 lg:py-16">
        <Container>
          {/* Results count */}
          <p className="text-sm text-slate mb-6">
            Showing{' '}
            <span className="font-semibold text-charcoal">
              {filteredPackages.length}
            </span>{' '}
            {filteredPackages.length === 1 ? 'package' : 'packages'}
          </p>

          <PackageGrid packages={filteredPackages} />
        </Container>
      </section>
    </>
  );
}
