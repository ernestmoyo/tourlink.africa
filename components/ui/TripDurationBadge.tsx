import { cn } from '@/lib/utils';

interface TripDurationBadgeProps {
  days: number;
  nights: number;
  className?: string;
}

export function TripDurationBadge({ days, nights, className }: TripDurationBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm text-slate font-medium', className)}>
      {/* Calendar icon */}
      <svg
        className="h-4 w-4 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span>
        {days} {days === 1 ? 'Day' : 'Days'} / {nights} {nights === 1 ? 'Night' : 'Nights'}
      </span>
    </span>
  );
}
