'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DESTINATION_NAMES, MEAL_LABELS } from '@/lib/constants';
import type { ItineraryDay, MealPlan } from '@/types';

interface ItineraryAccordionProps {
  itinerary: ItineraryDay[];
}

function MealIcon({ meal }: { meal: MealPlan }) {
  const label = MEAL_LABELS[meal];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand text-xs font-medium text-charcoal"
      title={label}
    >
      {meal === 'B' && (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      )}
      {meal === 'L' && (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      )}
      {meal === 'D' && (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      )}
      {label}
    </span>
  );
}

function AccordionItem({
  day,
  isExpanded,
  onToggle,
}: {
  day: ItineraryDay;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        'border-l-4 rounded-r-lg bg-white overflow-hidden transition-colors duration-300',
        isExpanded ? 'border-l-magenta shadow-card' : 'border-l-savanna'
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer group hover:bg-sand/50 transition-colors duration-200"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              'inline-flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold shrink-0 transition-colors duration-300',
              isExpanded
                ? 'bg-magenta text-white'
                : 'bg-savanna text-charcoal group-hover:bg-navy group-hover:text-white'
            )}
          >
            {day.dayNumber}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-charcoal truncate">
              {day.title}
            </h3>
            <span className="text-xs text-slate">
              {DESTINATION_NAMES[day.destination]}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={cn(
            'h-5 w-5 text-slate shrink-0 transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-4">
              {/* Description */}
              <p className="text-sm text-charcoal leading-relaxed">
                {day.description}
              </p>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Accommodation */}
                {day.accommodation && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider font-semibold text-slate mb-1">
                      Accommodation
                    </span>
                    <p className="text-sm text-charcoal">{day.accommodation}</p>
                  </div>
                )}

                {/* Meals */}
                {day.meals.length > 0 && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider font-semibold text-slate mb-1">
                      Meals Included
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {day.meals.map((meal) => (
                        <MealIcon key={meal} meal={meal} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Activities */}
              {day.activities.length > 0 && (
                <div>
                  <span className="block text-xs uppercase tracking-wider font-semibold text-slate mb-2">
                    Activities
                  </span>
                  <ul className="space-y-1.5">
                    {day.activities.map((activity) => (
                      <li
                        key={activity}
                        className="flex items-start gap-2 text-sm text-charcoal"
                      >
                        <svg
                          className="h-4 w-4 text-magenta shrink-0 mt-0.5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="9 11 12 14 22 4" />
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Transfer note */}
              {day.transferNote && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-sand">
                  <svg
                    className="h-4 w-4 text-ocean shrink-0 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <p className="text-xs text-charcoal">
                    <span className="font-semibold">Transfer:</span>{' '}
                    {day.transferNote}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ItineraryAccordion({ itinerary }: ItineraryAccordionProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const allExpanded = expandedDays.size === itinerary.length;

  function toggleDay(dayNumber: number) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNumber)) {
        next.delete(dayNumber);
      } else {
        next.add(dayNumber);
      }
      return next;
    });
  }

  function toggleAll() {
    if (allExpanded) {
      setExpandedDays(new Set());
    } else {
      setExpandedDays(new Set(itinerary.map((d) => d.dayNumber)));
    }
  }

  return (
    <div>
      {/* Header with expand/collapse toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-serif text-charcoal">
          Day-by-Day Itinerary
        </h2>
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm font-semibold text-magenta hover:text-magenta-dark transition-colors cursor-pointer"
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Accordion items */}
      <div className="space-y-3">
        {itinerary.map((day) => (
          <AccordionItem
            key={day.dayNumber}
            day={day}
            isExpanded={expandedDays.has(day.dayNumber)}
            onToggle={() => toggleDay(day.dayNumber)}
          />
        ))}
      </div>
    </div>
  );
}
