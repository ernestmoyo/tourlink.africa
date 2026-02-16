'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, SectionHeader, TestimonialCard } from '@/components/ui';
import { testimonials } from '@/data/testimonials';
import { cn } from '@/lib/utils';

export function TestimonialsSection() {
  const displayTestimonials = testimonials.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  // Auto-rotate on mobile every 5 seconds
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    if (!mql.matches) return;

    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeader
          eyebrow="Testimonials"
          heading="What Our Travelers Say"
          className="mb-12"
        />

        {/* Desktop: 3 cards in a row */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>

        {/* Mobile: single card with dots */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {displayTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-1"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {displayTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-colors cursor-pointer',
                  i === activeIndex ? 'bg-magenta' : 'bg-savanna'
                )}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
