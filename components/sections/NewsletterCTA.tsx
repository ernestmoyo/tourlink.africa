'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Container } from '@/components/ui';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid email');
      return;
    }

    // In a real app, this would call an API endpoint
    setSubmitted(true);
  }

  return (
    <section className="py-20 bg-gradient-to-r from-magenta to-navy">
      <Container variant="narrow">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-white font-serif text-3xl md:text-4xl lg:text-5xl">
            Get Early Access to New Packages &amp; Exclusive Deals
          </h2>
          <p className="text-white/80 text-lg mt-4">
            Join our newsletter for seasonal deals, new property openings, and insider travel tips.
          </p>

          {submitted ? (
            <div className="mt-8 bg-white/20 backdrop-blur rounded-xl p-6">
              <svg
                className="h-12 w-12 text-white mx-auto mb-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-white font-semibold text-lg">
                You&apos;re on the list!
              </p>
              <p className="text-white/80 text-sm mt-1">
                Check your inbox for a welcome email with our latest deals.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8" noValidate>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg text-charcoal placeholder:text-slate/60 focus:outline-2 focus:outline-white focus:outline-offset-2"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-white text-navy font-semibold hover:bg-white/90 transition-colors cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </div>
              {error && (
                <p className="text-white/90 text-sm mt-2 bg-white/20 inline-block px-3 py-1 rounded">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
