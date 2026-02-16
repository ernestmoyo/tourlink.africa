import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

type PriceUnit = 'per-person' | 'per-person-per-night';
type PriceSize = 'sm' | 'md' | 'lg';

interface PriceDisplayProps {
  priceFrom: number;
  priceTo?: number;
  unit: PriceUnit;
  size?: PriceSize;
  className?: string;
}

const unitLabels: Record<PriceUnit, string> = {
  'per-person': 'per person',
  'per-person-per-night': 'per person / night',
};

const sizeClasses: Record<PriceSize, { prefix: string; price: string; unit: string }> = {
  sm: {
    prefix: 'text-xs',
    price: 'text-lg font-bold',
    unit: 'text-xs',
  },
  md: {
    prefix: 'text-sm',
    price: 'text-2xl font-bold',
    unit: 'text-sm',
  },
  lg: {
    prefix: 'text-base',
    price: 'text-4xl font-bold',
    unit: 'text-base',
  },
};

export function PriceDisplay({
  priceFrom,
  priceTo,
  unit,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const styles = sizeClasses[size];

  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn(styles.prefix, 'text-slate')}>From</span>
      <span className={cn(styles.price, 'text-navy')}>
        {formatPrice(priceFrom)}
        {priceTo && (
          <span className="text-slate font-normal"> &ndash; {formatPrice(priceTo)}</span>
        )}
      </span>
      <span className={cn(styles.unit, 'text-slate')}>{unitLabels[unit]}</span>
    </div>
  );
}
