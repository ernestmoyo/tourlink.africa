'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Package, TierLevel, Destination, ExperienceType } from '@/types';

export interface PackageFilters {
  tiers: TierLevel[];
  destinations: Destination[];
  durationRange: string;
  experienceTypes: ExperienceType[];
  priceRange: string;
  sort: string;
}

const DEFAULT_FILTERS: PackageFilters = {
  tiers: [],
  destinations: [],
  durationRange: '',
  experienceTypes: [],
  priceRange: '',
  sort: 'name',
};

function matchesDuration(pkg: Package, range: string): boolean {
  if (!range) return true;
  const days = pkg.durationDays;
  switch (range) {
    case '1-7':
      return days >= 1 && days <= 7;
    case '8-14':
      return days >= 8 && days <= 14;
    case '15+':
      return days >= 15;
    default:
      return true;
  }
}

function matchesPrice(pkg: Package, range: string): boolean {
  if (!range) return true;
  const price = pkg.priceFrom;
  switch (range) {
    case '0-5000':
      return price >= 0 && price <= 5000;
    case '5000-10000':
      return price > 5000 && price <= 10000;
    case '10000-20000':
      return price > 10000 && price <= 20000;
    case '20000+':
      return price > 20000;
    default:
      return true;
  }
}

function sortPackages(packages: Package[], sort: string): Package[] {
  const sorted = [...packages];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    case 'price-desc':
      return sorted.sort((a, b) => b.priceFrom - a.priceFrom);
    case 'duration-asc':
      return sorted.sort((a, b) => a.durationDays - b.durationDays);
    case 'duration-desc':
      return sorted.sort((a, b) => b.durationDays - a.durationDays);
    case 'name':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function usePackageFilters(allPackages: Package[]) {
  const [filters, setFilters] = useState<PackageFilters>(DEFAULT_FILTERS);

  const setFilter = useCallback(
    <K extends keyof PackageFilters>(key: K, value: PackageFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.tiers.length > 0) count += filters.tiers.length;
    if (filters.destinations.length > 0) count += filters.destinations.length;
    if (filters.durationRange) count += 1;
    if (filters.experienceTypes.length > 0) count += filters.experienceTypes.length;
    if (filters.priceRange) count += 1;
    return count;
  }, [filters]);

  const filteredPackages = useMemo(() => {
    let result = allPackages;

    // Filter by tiers (OR within category)
    if (filters.tiers.length > 0) {
      result = result.filter((pkg) => filters.tiers.includes(pkg.tier));
    }

    // Filter by destinations (OR within category)
    if (filters.destinations.length > 0) {
      result = result.filter((pkg) =>
        pkg.destinations.some((d) => filters.destinations.includes(d))
      );
    }

    // Filter by duration range
    if (filters.durationRange) {
      result = result.filter((pkg) => matchesDuration(pkg, filters.durationRange));
    }

    // Filter by experience types (OR within category)
    if (filters.experienceTypes.length > 0) {
      result = result.filter((pkg) =>
        pkg.experienceTypes.some((e) => filters.experienceTypes.includes(e))
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      result = result.filter((pkg) => matchesPrice(pkg, filters.priceRange));
    }

    // Sort
    return sortPackages(result, filters.sort);
  }, [allPackages, filters]);

  return {
    filteredPackages,
    filters,
    setFilter,
    clearFilters,
    activeFilterCount,
  };
}
