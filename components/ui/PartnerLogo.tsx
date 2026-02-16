import { cn } from '@/lib/utils';

interface PartnerLogoProps {
  name: string;
  specialization: string;
  className?: string;
}

export function PartnerLogo({ name, specialization, className }: PartnerLogoProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 group',
        'transition-all duration-300',
        className
      )}
    >
      {/* Logo placeholder circle */}
      <div
        className={cn(
          'flex items-center justify-center',
          'h-20 w-20 rounded-full',
          'bg-navy text-white',
          'text-3xl font-bold font-serif',
          'grayscale group-hover:grayscale-0',
          'transition-all duration-300',
          'shadow-card group-hover:shadow-card-hover'
        )}
        aria-hidden="true"
      >
        {initial}
      </div>

      {/* Partner info */}
      <div className="text-center">
        <p className="font-semibold text-charcoal">{name}</p>
        <p className="text-sm text-slate">{specialization}</p>
      </div>
    </div>
  );
}
