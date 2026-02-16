import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  subtext?: string;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  subtext,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      {eyebrow && (
        <p className="text-sm uppercase tracking-widest font-semibold text-magenta mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-charcoal">
        {heading}
      </h2>
      {subtext && (
        <p
          className={cn(
            'text-lg text-slate max-w-2xl mt-4',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
