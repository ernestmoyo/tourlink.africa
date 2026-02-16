'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/lib/schemas';
import { cn, submitToFormspree } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const tripInterestOptions = [
  { value: 'safari', label: 'Safari' },
  { value: 'beach-island', label: 'Beach & Island' },
  { value: 'mountain-trekking', label: 'Mountain Trekking' },
  { value: 'cultural-heritage', label: 'Cultural & Heritage' },
  { value: 'multi-country', label: 'Multi-Country' },
  { value: 'visa-permits', label: 'Visa & Permits' },
  { value: 'other', label: 'Other' },
] as const;

const preferredContactOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const;

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setSubmitError('');
    const formId = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID;
    if (!formId) {
      setSubmitError('Form not configured. Please contact us directly at info@tourlink.africa');
      return;
    }
    const result = await submitToFormspree(formId, { ...data, _subject: `TourLink Contact: ${data.tripInterest}` });
    if (result.ok) {
      setIsSuccess(true);
      reset();
    } else {
      setSubmitError(result.error ?? 'Something went wrong.');
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl bg-white border border-success/20 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif text-charcoal">Thank You!</h3>
        <p className="text-slate mt-2">
          We&apos;ll respond within 24 hours. In the meantime, feel free to browse our{' '}
          <a href="/packages" className="text-magenta underline hover:text-magenta-dark">
            travel packages
          </a>.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-6 text-sm font-semibold text-navy hover:text-navy-dark underline cursor-pointer"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-1.5">
          Full Name <span className="text-magenta">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your full name"
          {...register('name')}
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-charcoal placeholder:text-slate/50',
            'focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent',
            'transition-colors duration-200',
            errors.name ? 'border-error' : 'border-savanna'
          )}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-1.5">
          Email Address <span className="text-magenta">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-charcoal placeholder:text-slate/50',
            'focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent',
            'transition-colors duration-200',
            errors.email ? 'border-error' : 'border-savanna'
          )}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-1.5">
          Phone Number <span className="text-slate text-xs">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register('phone')}
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-charcoal placeholder:text-slate/50',
            'focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent',
            'transition-colors duration-200',
            'border-savanna'
          )}
        />
      </div>

      {/* Trip Interest */}
      <div>
        <label htmlFor="tripInterest" className="block text-sm font-semibold text-charcoal mb-1.5">
          Trip Interest <span className="text-magenta">*</span>
        </label>
        <select
          id="tripInterest"
          {...register('tripInterest')}
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-charcoal bg-white',
            'focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent',
            'transition-colors duration-200',
            errors.tripInterest ? 'border-error' : 'border-savanna'
          )}
        >
          <option value="">Select your interest...</option>
          {tripInterestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.tripInterest && (
          <p className="mt-1 text-sm text-error">{errors.tripInterest.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-1.5">
          Message <span className="text-magenta">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your dream trip — destinations, dates, group size, budget range, any special requests..."
          {...register('message')}
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-charcoal placeholder:text-slate/50 resize-y',
            'focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent',
            'transition-colors duration-200',
            errors.message ? 'border-error' : 'border-savanna'
          )}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-error">{errors.message.message}</p>
        )}
      </div>

      {/* Preferred Contact Method */}
      <fieldset>
        <legend className="block text-sm font-semibold text-charcoal mb-3">
          Preferred Contact Method <span className="text-magenta">*</span>
        </legend>
        <div className="flex flex-wrap gap-4">
          {preferredContactOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                value={option.value}
                {...register('preferredContact')}
                className="w-4 h-4 text-navy border-savanna focus:ring-navy focus:ring-offset-0"
              />
              <span className="text-sm text-charcoal">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.preferredContact && (
          <p className="mt-1 text-sm text-error">{errors.preferredContact.message}</p>
        )}
      </fieldset>

      {/* Error */}
      {submitError && (
        <p className="text-sm text-error bg-error/10 rounded-lg p-3">{submitError}</p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        loading={isSubmitting}
        fullWidth
        size="lg"
      >
        Send Inquiry
      </Button>
    </form>
  );
}
