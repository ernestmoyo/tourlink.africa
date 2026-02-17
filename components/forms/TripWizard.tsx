'use client';

import { useState, useCallback } from 'react';
import { cn, submitToFormspree } from '@/lib/utils';
import {
  DESTINATION_NAMES,
  EXPERIENCE_TYPE_LABELS,
  TIER_CONFIG,
  MONTHS,
} from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { TripRecommendations } from '@/components/forms/TripRecommendations';
import type { Destination, ExperienceType, TierLevel } from '@/types';

/* ─── Types ───────────────────────────────────────────────────── */

interface FormData {
  destinations: string[];
  experienceType: string;
  budgetTier: string;
  duration: string;
  groupType: string;
  preferredMonth: number | null;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const INITIAL_FORM_DATA: FormData = {
  destinations: [],
  experienceType: '',
  budgetTier: '',
  duration: '',
  groupType: '',
  preferredMonth: null,
  name: '',
  email: '',
  phone: '',
  message: '',
};

const STEP_LABELS = [
  'Where',
  'Experience',
  'Budget',
  'Duration',
  'Group',
  'When',
  'Contact',
  'Review',
];

const TOTAL_STEPS = STEP_LABELS.length;

/* ─── Budget tiers ────────────────────────────────────────────── */

const BUDGET_OPTIONS: { key: TierLevel; name: string; range: string }[] = [
  { key: 'budget', name: 'Budget', range: '$2k - $5k' },
  { key: 'mid-range', name: 'Mid-Range', range: '$5k - $12k' },
  { key: 'luxury', name: 'Luxury', range: '$12k - $25k' },
  { key: 'ultra-luxury', name: 'Ultra-Luxury', range: '$25k+' },
];

/* ─── Duration options ────────────────────────────────────────── */

const DURATION_OPTIONS = [
  { key: '5-7', label: '5-7 Days', desc: 'Short getaway' },
  { key: '8-10', label: '8-10 Days', desc: 'Classic trip' },
  { key: '11-14', label: '11-14 Days', desc: 'In-depth explorer' },
  { key: '15+', label: '15+ Days', desc: 'Grand adventure' },
];

/* ─── Group types ─────────────────────────────────────────────── */

const GROUP_OPTIONS = [
  { key: 'solo', label: 'Solo' },
  { key: 'couple', label: 'Couple' },
  { key: 'family', label: 'Family' },
  { key: 'friends', label: 'Friends Group' },
  { key: 'corporate', label: 'Corporate' },
];

/* ─── Month season classification ─────────────────────────────── */

function getMonthSeason(monthIdx: number): { label: string; class: string } {
  // monthIdx is 0-based (Jan=0)
  const month = monthIdx + 1;
  // Peak: Jun(6) - Sep(9)
  if (month >= 6 && month <= 9) return { label: 'Peak Season', class: 'peak' };
  // Shoulder: May(5), Oct(10)
  if (month === 5 || month === 10) return { label: 'Shoulder', class: 'shoulder' };
  // Green: Nov(11) - Apr(4)
  return { label: 'Green Season', class: 'green' };
}

/* ─── SVG Icons ───────────────────────────────────────────────── */

function ExperienceIcon({ type, className }: { type: string; className?: string }) {
  const cls = cn('h-8 w-8', className);

  switch (type) {
    case 'safari':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
          <path d="M7 3c0 0-1 2 0 4M17 3c0 0 1 2 0 4" />
        </svg>
      );
    case 'beach':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21H7" />
          <path d="M12 3v18" />
          <path d="M12 3c-3 0-6 3-6 3h12s-3-3-6-3z" />
          <path d="M3 17c2-1 4 0 6-1s4 0 6-1 4 0 6-1" />
        </svg>
      );
    case 'mountain':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 21l4-10 4 10" />
          <path d="M2 21l6-12 3 6" />
          <path d="M14 15l4-8 4 8" />
          <path d="M2 21h20" />
        </svg>
      );
    case 'cultural':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-4h6v4" />
          <rect x="9" y="9" width="6" height="4" />
        </svg>
      );
    case 'bush-and-beach':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 17c2-1 4 0 6-1s4 0 6-1 4 0 6-1" />
          <circle cx="8" cy="8" r="4" />
          <path d="M16 4l2 6h-4l2-6z" />
          <path d="M14 10h4" />
        </svg>
      );
    case 'overland':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="8" width="20" height="8" rx="2" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
          <path d="M5 8V6a1 1 0 011-1h4l2 3" />
          <line x1="14" y1="8" x2="14" y2="12" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
  }
}

function GroupIcon({ type, className }: { type: string; className?: string }) {
  const cls = cn('h-8 w-8', className);

  switch (type) {
    case 'solo':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        </svg>
      );
    case 'couple':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="8" r="3" />
          <circle cx="15" cy="8" r="3" />
          <path d="M4 21v-2a3 3 0 013-3h2" />
          <path d="M15 16h2a3 3 0 013 3v2" />
          <path d="M12 12v2a4 4 0 01-4 4" />
          <path d="M12 12v2a4 4 0 004 4" />
        </svg>
      );
    case 'family':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="8" cy="6" r="3" />
          <circle cx="16" cy="6" r="3" />
          <circle cx="12" cy="13" r="2" />
          <path d="M3 21v-2a3 3 0 013-3h2" />
          <path d="M16 16h2a3 3 0 013 3v2" />
          <path d="M9 21v-1a3 3 0 016 0v1" />
        </svg>
      );
    case 'friends':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <circle cx="12" cy="14" r="3" />
          <path d="M2 21v-1a3 3 0 013-3h1" />
          <path d="M18 17h1a3 3 0 013 3v1" />
          <path d="M9 21v-1a3 3 0 016 0v1" />
        </svg>
      );
    case 'corporate':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M3 9h18M3 15h18" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Progress Bar ────────────────────────────────────────────── */

function ProgressBar({ currentStep }: { currentStep: number }) {
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="mb-8">
      {/* Step label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-navy">
          Step {currentStep + 1} of {TOTAL_STEPS}: {STEP_LABELS[currentStep]}
        </span>
        <span className="text-xs text-slate">
          {Math.round(progress)}% complete
        </span>
      </div>

      {/* Bar */}
      <div className="h-2 w-full rounded-full bg-sand overflow-hidden">
        <div
          className="h-full rounded-full bg-magenta transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Dots */}
      <div className="flex justify-between mt-2">
        {STEP_LABELS.map((label, idx) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className={cn(
                'h-3 w-3 rounded-full border-2 transition-all duration-300',
                idx < currentStep
                  ? 'bg-magenta border-magenta'
                  : idx === currentStep
                    ? 'bg-white border-magenta scale-125'
                    : 'bg-sand border-sand'
              )}
            />
            <span className="text-[10px] text-slate mt-1 hidden sm:block">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 0: Destinations ────────────────────────────────────── */

function StepDestinations({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (destinations: string[]) => void;
}) {
  const toggle = (dest: string) => {
    if (selected.includes(dest)) {
      onChange(selected.filter((d) => d !== dest));
    } else {
      onChange([...selected, dest]);
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">
        Where would you like to go?
      </h2>
      <p className="text-slate mb-6">Select one or more destinations.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(Object.entries(DESTINATION_NAMES) as [Destination, string][]).map(
          ([slug, name]) => {
            const isSelected = selected.includes(slug);
            return (
              <button
                key={slug}
                type="button"
                onClick={() => toggle(slug)}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer',
                  'hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
                  isSelected
                    ? 'border-magenta bg-magenta/5 shadow-sm'
                    : 'border-sand bg-white hover:border-navy/30'
                )}
              >
                {/* Checkbox indicator */}
                <div
                  className={cn(
                    'absolute top-2 right-2 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                    isSelected
                      ? 'border-magenta bg-magenta'
                      : 'border-slate/30 bg-white'
                  )}
                >
                  {isSelected && (
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>

                {/* Globe icon */}
                <svg
                  className={cn(
                    'h-8 w-8 transition-colors',
                    isSelected ? 'text-magenta' : 'text-navy/50'
                  )}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>

                <span
                  className={cn(
                    'text-sm font-semibold transition-colors text-center',
                    isSelected ? 'text-magenta' : 'text-navy'
                  )}
                >
                  {name}
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

/* ─── Step 1: Experience Type ─────────────────────────────────── */

function StepExperience({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (type: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">
        What type of experience?
      </h2>
      <p className="text-slate mb-6">Choose the experience that excites you most.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {(
          Object.entries(EXPERIENCE_TYPE_LABELS) as [ExperienceType, string][]
        ).map(([key, label]) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer',
                'hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
                isSelected
                  ? 'border-magenta bg-magenta/5 shadow-sm'
                  : 'border-sand bg-white hover:border-navy/30'
              )}
            >
              <ExperienceIcon
                type={key}
                className={isSelected ? 'text-magenta' : 'text-navy/50'}
              />
              <span
                className={cn(
                  'text-sm font-semibold transition-colors text-center',
                  isSelected ? 'text-magenta' : 'text-navy'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 2: Budget ──────────────────────────────────────────── */

function StepBudget({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (tier: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">
        What&apos;s your budget range?
      </h2>
      <p className="text-slate mb-6">Per person, including accommodation and activities.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BUDGET_OPTIONS.map(({ key, name, range }) => {
          const isSelected = selected === key;
          const config = TIER_CONFIG[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer',
                'hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
                isSelected
                  ? 'border-magenta bg-magenta/5 shadow-sm'
                  : 'border-sand bg-white hover:border-navy/30'
              )}
            >
              <span
                className={cn(
                  'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                  config.bgColor,
                  config.textColor
                )}
              >
                {name}
              </span>
              <span
                className={cn(
                  'text-lg font-bold transition-colors',
                  isSelected ? 'text-magenta' : 'text-navy'
                )}
              >
                {range}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 3: Duration ────────────────────────────────────────── */

function StepDuration({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (duration: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">
        How long is your trip?
      </h2>
      <p className="text-slate mb-6">Choose your ideal trip length.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {DURATION_OPTIONS.map(({ key, label, desc }) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer',
                'hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
                isSelected
                  ? 'border-magenta bg-magenta/5 shadow-sm'
                  : 'border-sand bg-white hover:border-navy/30'
              )}
            >
              <svg
                className={cn(
                  'h-8 w-8 transition-colors',
                  isSelected ? 'text-magenta' : 'text-navy/50'
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span
                className={cn(
                  'text-sm font-bold transition-colors',
                  isSelected ? 'text-magenta' : 'text-navy'
                )}
              >
                {label}
              </span>
              <span className="text-xs text-slate">{desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 4: Group Type ──────────────────────────────────────── */

function StepGroup({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (group: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">
        Who are you travelling with?
      </h2>
      <p className="text-slate mb-6">This helps us recommend the right group size.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {GROUP_OPTIONS.map(({ key, label }) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer',
                'hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
                isSelected
                  ? 'border-magenta bg-magenta/5 shadow-sm'
                  : 'border-sand bg-white hover:border-navy/30'
              )}
            >
              <GroupIcon
                type={key}
                className={isSelected ? 'text-magenta' : 'text-navy/50'}
              />
              <span
                className={cn(
                  'text-sm font-semibold transition-colors text-center',
                  isSelected ? 'text-magenta' : 'text-navy'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 5: When (Month) ────────────────────────────────────── */

function StepWhen({
  selected,
  onChange,
}: {
  selected: number | null;
  onChange: (month: number | null) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">
        When would you like to travel?
      </h2>
      <p className="text-slate mb-4">
        Select a month, or skip if you&apos;re flexible.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-olive" />
          Green Season (Nov - Apr)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-gold" />
          Shoulder (May, Oct)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-magenta" />
          Peak Season (Jun - Sep)
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {MONTHS.map((month, idx) => {
          const season = getMonthSeason(idx);
          const isSelected = selected === idx + 1;
          const monthNum = idx + 1;

          const seasonColorClasses =
            season.class === 'green'
              ? 'border-olive/40 hover:border-olive'
              : season.class === 'shoulder'
                ? 'border-gold/40 hover:border-gold'
                : 'border-magenta/40 hover:border-magenta';

          const seasonBadgeBg =
            season.class === 'green'
              ? 'bg-olive/15 text-olive'
              : season.class === 'shoulder'
                ? 'bg-gold/15 text-gold'
                : 'bg-magenta/15 text-magenta';

          return (
            <button
              key={month}
              type="button"
              onClick={() => onChange(isSelected ? null : monthNum)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
                isSelected
                  ? 'border-magenta bg-magenta/10 shadow-sm ring-2 ring-magenta/20'
                  : seasonColorClasses + ' bg-white hover:shadow-sm'
              )}
            >
              <span
                className={cn(
                  'text-sm font-bold transition-colors',
                  isSelected ? 'text-magenta' : 'text-navy'
                )}
              >
                {month.slice(0, 3)}
              </span>
              <span
                className={cn(
                  'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                  isSelected ? 'bg-magenta/20 text-magenta' : seasonBadgeBg
                )}
              >
                {season.label}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-4 text-sm text-slate hover:text-magenta transition-colors underline"
        >
          Clear selection (I&apos;m flexible)
        </button>
      )}
    </div>
  );
}

/* ─── Step 6: Contact ─────────────────────────────────────────── */

function StepContact({
  formData,
  onChange,
  errors,
}: {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">
        How can we reach you?
      </h2>
      <p className="text-slate mb-6">
        We&apos;ll send your custom itinerary to this email.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        {/* Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="wizard-name"
            className="block text-sm font-semibold text-navy mb-1"
          >
            Full Name <span className="text-magenta">*</span>
          </label>
          <input
            id="wizard-name"
            type="text"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Your full name"
            className={cn(
              'w-full rounded-lg border-2 px-4 py-3 text-charcoal bg-white placeholder:text-slate/50',
              'transition-colors focus:outline-none focus:border-magenta',
              errors.name ? 'border-red-400' : 'border-sand'
            )}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label
            htmlFor="wizard-email"
            className="block text-sm font-semibold text-navy mb-1"
          >
            Email Address <span className="text-magenta">*</span>
          </label>
          <input
            id="wizard-email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="you@example.com"
            className={cn(
              'w-full rounded-lg border-2 px-4 py-3 text-charcoal bg-white placeholder:text-slate/50',
              'transition-colors focus:outline-none focus:border-magenta',
              errors.email ? 'border-red-400' : 'border-sand'
            )}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <label
            htmlFor="wizard-phone"
            className="block text-sm font-semibold text-navy mb-1"
          >
            Phone Number <span className="text-slate text-xs">(optional)</span>
          </label>
          <input
            id="wizard-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+27 xx xxx xxxx"
            className={cn(
              'w-full rounded-lg border-2 px-4 py-3 text-charcoal bg-white placeholder:text-slate/50',
              'transition-colors focus:outline-none focus:border-magenta border-sand'
            )}
          />
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label
            htmlFor="wizard-message"
            className="block text-sm font-semibold text-navy mb-1"
          >
            Any special requests?{' '}
            <span className="text-slate text-xs">(optional)</span>
          </label>
          <textarea
            id="wizard-message"
            value={formData.message}
            onChange={(e) => onChange('message', e.target.value)}
            placeholder="Tell us about any special requirements, interests, or questions..."
            rows={4}
            className={cn(
              'w-full rounded-lg border-2 px-4 py-3 text-charcoal bg-white placeholder:text-slate/50',
              'transition-colors focus:outline-none focus:border-magenta border-sand resize-none'
            )}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Step 7: Review ──────────────────────────────────────────── */

function StepReview({ formData }: { formData: FormData }) {
  const destinationNames = formData.destinations
    .map((d) => DESTINATION_NAMES[d as Destination] || d)
    .join(', ');

  const experienceLabel =
    EXPERIENCE_TYPE_LABELS[formData.experienceType as ExperienceType] ||
    formData.experienceType;

  const budgetOption = BUDGET_OPTIONS.find((b) => b.key === formData.budgetTier);
  const durationOption = DURATION_OPTIONS.find(
    (d) => d.key === formData.duration
  );
  const groupOption = GROUP_OPTIONS.find((g) => g.key === formData.groupType);
  const monthName = formData.preferredMonth
    ? MONTHS[formData.preferredMonth - 1]
    : 'Flexible';

  const rows = [
    { label: 'Destinations', value: destinationNames },
    { label: 'Experience', value: experienceLabel },
    {
      label: 'Budget',
      value: budgetOption ? `${budgetOption.name} (${budgetOption.range})` : '-',
    },
    { label: 'Duration', value: durationOption ? durationOption.label : '-' },
    { label: 'Group', value: groupOption ? groupOption.label : '-' },
    { label: 'Travel Month', value: monthName },
    { label: 'Name', value: formData.name },
    { label: 'Email', value: formData.email },
    ...(formData.phone ? [{ label: 'Phone', value: formData.phone }] : []),
    ...(formData.message
      ? [{ label: 'Message', value: formData.message }]
      : []),
  ];

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">
        Review Your Trip
      </h2>
      <p className="text-slate mb-6">
        Check your selections below. Click Back to make changes, or Submit to
        send your request.
      </p>

      <div className="rounded-xl border border-sand bg-white overflow-hidden max-w-xl">
        {rows.map(({ label, value }, idx) => (
          <div
            key={label}
            className={cn(
              'flex gap-4 px-5 py-3',
              idx % 2 === 0 ? 'bg-savanna/30' : 'bg-white'
            )}
          >
            <span className="w-32 shrink-0 text-sm font-semibold text-navy">
              {label}
            </span>
            <span className="text-sm text-charcoal">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Wizard ─────────────────────────────────────────────── */

export function TripWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [direction, setDirection] = useState<'next' | 'back'>('next');

  /* ── Field updater ────────────────────────────────────────── */
  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear related error on change
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field as string];
        return copy;
      });
    },
    []
  );

  /* ── Validation per step ──────────────────────────────────── */
  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (formData.destinations.length === 0)
          newErrors.destinations = 'Please select at least one destination.';
        break;
      case 1:
        if (!formData.experienceType)
          newErrors.experienceType = 'Please select an experience type.';
        break;
      case 2:
        if (!formData.budgetTier)
          newErrors.budgetTier = 'Please select a budget tier.';
        break;
      case 3:
        if (!formData.duration)
          newErrors.duration = 'Please select a duration.';
        break;
      case 4:
        if (!formData.groupType)
          newErrors.groupType = 'Please select a group type.';
        break;
      case 5:
        // Month is optional
        break;
      case 6: {
        const name = formData.name.trim();
        const email = formData.email.trim();
        if (!name || name.length < 2)
          newErrors.name = 'Name must be at least 2 characters.';
        if (!email) {
          newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          newErrors.email = 'Please enter a valid email address.';
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData]);

  /* ── Navigation ───────────────────────────────────────────── */
  const goNext = useCallback(() => {
    if (!validateStep()) return;
    setDirection('next');
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, [validateStep]);

  const goBack = useCallback(() => {
    setDirection('back');
    setCurrentStep((s) => Math.max(s - 1, 0));
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;
    setSubmitError('');
    setSubmitting(true);

    const formId = process.env.NEXT_PUBLIC_FORMSPREE_TRIP_ID;
    if (!formId) {
      setSubmitError('Form not configured. Please contact us directly at info@tourlink.africa');
      setSubmitting(false);
      return;
    }

    const result = await submitToFormspree(formId, {
      ...formData,
      destinations: formData.destinations.join(', '),
      preferredMonth: formData.preferredMonth ? MONTHS[formData.preferredMonth - 1] : 'Flexible',
      _subject: `TourLink Trip Planner: ${formData.name}`,
    });

    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error ?? 'Submission failed. Please try again.');
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [validateStep, formData]);

  /* ── Submitted state ──────────────────────────────────────── */
  if (submitted) {
    return <TripRecommendations formData={formData} />;
  }

  /* ── Render step content ──────────────────────────────────── */
  const stepContent = (() => {
    switch (currentStep) {
      case 0:
        return (
          <StepDestinations
            selected={formData.destinations}
            onChange={(v) => updateField('destinations', v)}
          />
        );
      case 1:
        return (
          <StepExperience
            selected={formData.experienceType}
            onChange={(v) => updateField('experienceType', v)}
          />
        );
      case 2:
        return (
          <StepBudget
            selected={formData.budgetTier}
            onChange={(v) => updateField('budgetTier', v)}
          />
        );
      case 3:
        return (
          <StepDuration
            selected={formData.duration}
            onChange={(v) => updateField('duration', v)}
          />
        );
      case 4:
        return (
          <StepGroup
            selected={formData.groupType}
            onChange={(v) => updateField('groupType', v)}
          />
        );
      case 5:
        return (
          <StepWhen
            selected={formData.preferredMonth}
            onChange={(v) => updateField('preferredMonth', v)}
          />
        );
      case 6:
        return (
          <StepContact
            formData={formData}
            onChange={(field, value) => updateField(field, value)}
            errors={errors}
          />
        );
      case 7:
        return <StepReview formData={formData} />;
      default:
        return null;
    }
  })();

  /* ── Error banner for card-selection steps ────────────────── */
  const stepError =
    errors.destinations ||
    errors.experienceType ||
    errors.budgetTier ||
    errors.duration ||
    errors.groupType;

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <div className="rounded-2xl border border-sand bg-white shadow-sm p-6 sm:p-8 md:p-10">
      <ProgressBar currentStep={currentStep} />

      {/* Step content with slide transition */}
      <div className="relative overflow-hidden">
        <div
          key={currentStep}
          style={{
            animation:
              direction === 'next'
                ? 'slide-in-right 0.3s ease-out forwards'
                : 'slide-in-left 0.3s ease-out forwards',
          }}
        >
          {stepContent}
        </div>
      </div>

      {/* Step-level error */}
      {stepError && (
        <p className="mt-4 text-sm text-red-500 font-medium">{stepError}</p>
      )}

      {/* Submit error */}
      {submitError && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-lg p-3 font-medium">{submitError}</p>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-sand">
        {currentStep > 0 ? (
          <Button variant="ghost" onClick={goBack}>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
        ) : (
          <div />
        )}

        {isLastStep ? (
          <Button variant="primary" size="lg" onClick={handleSubmit} loading={submitting}>
            {submitting ? 'Submitting...' : 'Submit My Trip Request'}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </Button>
        ) : (
          <Button variant="primary" onClick={goNext}>
            Next
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
