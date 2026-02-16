import { cn } from '@/lib/utils';
import { TIER_CONFIG } from '@/lib/constants';
import type { TierLevel } from '@/types';

interface BadgeProps {
  tier: TierLevel;
  className?: string;
}

export function Badge({ tier, className }: BadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  );
}
