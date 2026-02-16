'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <section className="min-h-[70vh] bg-sand flex items-center">
      <Container variant="narrow" className="py-20 text-center">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-navy/10">
          <svg
            className="h-10 w-10 text-navy"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-navy mb-4">
          Something Went Wrong
        </h1>
        <p className="text-lg text-slate max-w-md mx-auto mb-10">
          We encountered an unexpected error. Please try again, or head back to the
          homepage if the issue persists.
        </p>

        {error.digest && (
          <p className="text-xs text-slate/60 mb-6 font-mono">
            Error reference: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Button asChild href="/" variant="secondary" size="lg">
            Back to Homepage
          </Button>
        </div>
      </Container>
    </section>
  );
}
