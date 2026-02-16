import { formatPrice } from '@/lib/utils';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import type { Package, Season } from '@/types';

interface PricingTableProps {
  pkg: Package;
}

const SEASON_CONFIG: Record<Season, { label: string; description: string; bgClass: string }> = {
  peak: {
    label: 'Peak Season',
    description: 'Jun - Oct',
    bgClass: 'bg-magenta/5',
  },
  shoulder: {
    label: 'Shoulder Season',
    description: 'Apr - May, Nov',
    bgClass: 'bg-gold/10',
  },
  green: {
    label: 'Green Season',
    description: 'Dec - Mar',
    bgClass: 'bg-olive/10',
  },
};

export function PricingTable({ pkg }: PricingTableProps) {
  const hasSeasonalPricing = pkg.seasonalPricing && Object.keys(pkg.seasonalPricing).length > 0;

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-8">
        Pricing
      </h2>

      {hasSeasonalPricing ? (
        /* Seasonal pricing table */
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {(Object.entries(pkg.seasonalPricing!) as [Season, { from: number; to?: number }][]).map(
              ([season, pricing]) => {
                const config = SEASON_CONFIG[season];
                return (
                  <div
                    key={season}
                    className={`p-6 lg:p-8 text-center border-b md:border-b-0 md:border-r border-savanna last:border-r-0 last:border-b-0 ${config.bgClass}`}
                  >
                    <h3 className="text-lg font-semibold text-charcoal mb-1">
                      {config.label}
                    </h3>
                    <p className="text-xs text-slate mb-4">{config.description}</p>
                    <p className="text-3xl font-bold text-navy mb-1">
                      {formatPrice(pricing.from)}
                      {pricing.to && (
                        <span className="text-lg font-normal text-slate">
                          {' '}&ndash; {formatPrice(pricing.to)}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-slate">
                      {pkg.priceUnit === 'per-person' ? 'per person' : 'per person / night'}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      ) : (
        /* Simple pricing display */
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <PriceDisplay
            priceFrom={pkg.priceFrom}
            priceTo={pkg.priceTo}
            unit={pkg.priceUnit}
            size="lg"
            className="items-center"
          />
        </div>
      )}

      {/* Note */}
      <p className="text-sm text-slate text-center mt-4">
        Prices include park fees, accommodation, meals, and transfers as outlined in the
        inclusions above. International flights and visa fees are not included.
      </p>

      {/* CTA */}
      <div className="flex justify-center mt-8">
        <Button asChild href="/contact" size="lg">
          Enquire About This Package
        </Button>
      </div>
    </div>
  );
}
