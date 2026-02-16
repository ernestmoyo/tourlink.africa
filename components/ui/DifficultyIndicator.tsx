import { cn } from '@/lib/utils';

type DifficultyLevel = 'easy' | 'moderate' | 'challenging';

interface DifficultyIndicatorProps {
  difficulty: DifficultyLevel;
  className?: string;
}

const difficultyConfig: Record<
  DifficultyLevel,
  { filledCount: number; color: string; label: string }
> = {
  easy: {
    filledCount: 1,
    color: 'bg-olive',
    label: 'Easy',
  },
  moderate: {
    filledCount: 2,
    color: 'bg-gold',
    label: 'Moderate',
  },
  challenging: {
    filledCount: 3,
    color: 'bg-magenta',
    label: 'Challenging',
  },
};

export function DifficultyIndicator({ difficulty, className }: DifficultyIndicatorProps) {
  const config = difficultyConfig[difficulty];

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-2.5 w-2.5 rounded-full transition-colors duration-200',
              i < config.filledCount ? config.color : 'bg-savanna'
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-charcoal">{config.label}</span>
    </div>
  );
}
