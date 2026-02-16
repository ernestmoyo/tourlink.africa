import { SectionHeader } from '@/components/ui/SectionHeader';

interface IncludesExcludesProps {
  included: string[];
  excluded: string[];
}

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 text-success shrink-0 mt-0.5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-5 w-5 text-error shrink-0 mt-0.5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function IncludesExcludes({ included, excluded }: IncludesExcludesProps) {
  return (
    <div>
      <SectionHeader
        eyebrow="What to Expect"
        heading="Included & Excluded"
        align="left"
        className="mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Included */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-card">
          <h3 className="text-lg font-semibold text-charcoal mb-5 flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-success/10">
              <svg
                className="h-4 w-4 text-success"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            What&apos;s Included
          </h3>
          <ul className="space-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-charcoal">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Excluded */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-card">
          <h3 className="text-lg font-semibold text-charcoal mb-5 flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-error/10">
              <svg
                className="h-4 w-4 text-error"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
            Not Included
          </h3>
          <ul className="space-y-3">
            {excluded.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-charcoal">
                <XIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
