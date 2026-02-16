'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  TIER_CONFIG,
  DESTINATION_NAMES,
  EXPERIENCE_TYPE_LABELS,
} from '@/lib/constants';
import type {
  TierLevel,
  Destination,
  ExperienceType,
} from '@/types';
import type { PackageFilters } from '@/hooks/usePackageFilters';
import { Container } from '@/components/ui/Container';

interface PackageFilterBarProps {
  filters: PackageFilters;
  setFilter: <K extends keyof PackageFilters>(key: K, value: PackageFilters[K]) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

const TIER_OPTIONS: TierLevel[] = ['budget', 'mid-range', 'luxury', 'ultra-luxury'];
const DESTINATION_OPTIONS: Destination[] = [
  'south-africa',
  'tanzania',
  'zimbabwe',
  'mozambique',
  'namibia',
  'botswana',
  'kenya',
  'zambia',
];
const EXPERIENCE_OPTIONS: ExperienceType[] = [
  'safari',
  'beach',
  'mountain',
  'cultural',
  'bush-and-beach',
  'overland',
];
const DURATION_OPTIONS = [
  { value: '1-7', label: '1-7 Days' },
  { value: '8-14', label: '8-14 Days' },
  { value: '15+', label: '15+ Days' },
];
const PRICE_OPTIONS = [
  { value: '0-5000', label: 'Under $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000-20000', label: '$10,000 - $20,000' },
  { value: '20000+', label: '$20,000+' },
];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'duration-asc', label: 'Duration: Short to Long' },
  { value: 'duration-desc', label: 'Duration: Long to Short' },
];

function toggleArrayItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

function PillButton({
  active,
  onClick,
  children,
  colorClass,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  colorClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap',
        active
          ? colorClass || 'bg-navy text-white border-navy'
          : 'bg-white text-charcoal border-savanna hover:border-navy hover:text-navy'
      )}
    >
      {children}
    </button>
  );
}

export function PackageFilterBar({
  filters,
  setFilter,
  clearFilters,
  activeFilterCount,
}: PackageFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm shadow-nav transition-shadow duration-300">
      <Container>
        {/* Mobile toggle */}
        <div className="flex items-center justify-between py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-savanna text-charcoal font-semibold text-sm hover:border-navy transition-colors cursor-pointer"
          >
            {/* Filter icon */}
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
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-magenta text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort on mobile */}
          <select
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="px-3 py-2 rounded-lg border border-savanna text-sm text-charcoal bg-white cursor-pointer focus:outline-none focus:border-navy"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter sections */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 lg:block',
            isOpen ? 'max-h-[2000px] pb-4' : 'max-h-0 lg:max-h-none'
          )}
        >
          <div className="space-y-4 py-4">
            {/* Row 1: Tier + Destination */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
              {/* Tier */}
              <div className="flex-shrink-0">
                <span className="block text-xs uppercase tracking-wider font-semibold text-slate mb-2">
                  Tier
                </span>
                <div className="flex flex-wrap gap-2">
                  {TIER_OPTIONS.map((tier) => {
                    const config = TIER_CONFIG[tier];
                    const isActive = filters.tiers.includes(tier);
                    return (
                      <PillButton
                        key={tier}
                        active={isActive}
                        onClick={() =>
                          setFilter('tiers', toggleArrayItem(filters.tiers, tier))
                        }
                        colorClass={
                          isActive
                            ? `${config.bgColor} ${config.textColor} border-transparent`
                            : undefined
                        }
                      >
                        {config.label}
                      </PillButton>
                    );
                  })}
                </div>
              </div>

              {/* Destination */}
              <div className="flex-1 min-w-0">
                <span className="block text-xs uppercase tracking-wider font-semibold text-slate mb-2">
                  Destination
                </span>
                <div className="flex flex-wrap gap-2">
                  {DESTINATION_OPTIONS.map((dest) => (
                    <PillButton
                      key={dest}
                      active={filters.destinations.includes(dest)}
                      onClick={() =>
                        setFilter(
                          'destinations',
                          toggleArrayItem(filters.destinations, dest)
                        )
                      }
                    >
                      {DESTINATION_NAMES[dest]}
                    </PillButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Duration + Experience + Price */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
              {/* Duration */}
              <div className="flex-shrink-0">
                <span className="block text-xs uppercase tracking-wider font-semibold text-slate mb-2">
                  Duration
                </span>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <PillButton
                      key={opt.value}
                      active={filters.durationRange === opt.value}
                      onClick={() =>
                        setFilter(
                          'durationRange',
                          filters.durationRange === opt.value ? '' : opt.value
                        )
                      }
                    >
                      {opt.label}
                    </PillButton>
                  ))}
                </div>
              </div>

              {/* Experience type */}
              <div className="flex-1 min-w-0">
                <span className="block text-xs uppercase tracking-wider font-semibold text-slate mb-2">
                  Experience
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_OPTIONS.map((exp) => (
                    <PillButton
                      key={exp}
                      active={filters.experienceTypes.includes(exp)}
                      onClick={() =>
                        setFilter(
                          'experienceTypes',
                          toggleArrayItem(filters.experienceTypes, exp)
                        )
                      }
                    >
                      {EXPERIENCE_TYPE_LABELS[exp]}
                    </PillButton>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="flex-shrink-0">
                <span className="block text-xs uppercase tracking-wider font-semibold text-slate mb-2">
                  Price Range
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRICE_OPTIONS.map((opt) => (
                    <PillButton
                      key={opt.value}
                      active={filters.priceRange === opt.value}
                      onClick={() =>
                        setFilter(
                          'priceRange',
                          filters.priceRange === opt.value ? '' : opt.value
                        )
                      }
                    >
                      {opt.label}
                    </PillButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Sort (desktop) + Active count + Clear */}
            <div className="flex items-center justify-between pt-2 border-t border-savanna">
              {/* Sort dropdown (desktop) */}
              <div className="hidden lg:flex items-center gap-3">
                <label
                  htmlFor="sort-select"
                  className="text-xs uppercase tracking-wider font-semibold text-slate"
                >
                  Sort by
                </label>
                <select
                  id="sort-select"
                  value={filters.sort}
                  onChange={(e) => setFilter('sort', e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-savanna text-sm text-charcoal bg-white cursor-pointer focus:outline-none focus:border-navy"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active filter count + Clear all */}
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <>
                    <span className="text-sm text-slate">
                      <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-magenta text-white text-[10px] font-bold mr-1.5">
                        {activeFilterCount}
                      </span>
                      active {activeFilterCount === 1 ? 'filter' : 'filters'}
                    </span>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm font-semibold text-magenta hover:text-magenta-dark transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
