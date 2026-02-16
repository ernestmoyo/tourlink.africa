import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={cn('h-5 w-5', filled ? 'text-gold' : 'text-savanna')}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const { name, location, trip, rating, quote } = testimonial;

  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl shadow-card p-8',
        'transition-shadow duration-300 hover:shadow-card-hover',
        className
      )}
    >
      {/* Decorative quotation mark */}
      <span
        className="absolute top-4 left-6 text-6xl leading-none font-serif text-magenta/20 select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote */}
      <blockquote className="relative pt-8 mb-6">
        <p className="text-charcoal italic font-serif text-lg leading-relaxed">
          {quote}
        </p>
      </blockquote>

      {/* Star rating */}
      <div className="flex items-center gap-0.5 mb-4" aria-label={`Rating: ${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>

      {/* Attribution */}
      <div>
        <p className="font-bold text-charcoal">{name}</p>
        <p className="text-sm text-slate">{trip} &middot; {location}</p>
      </div>
    </div>
  );
}
