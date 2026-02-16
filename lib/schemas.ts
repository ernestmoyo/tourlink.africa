import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  tripInterest: z.enum(
    ['safari', 'beach-island', 'mountain-trekking', 'cultural-heritage', 'multi-country', 'visa-permits', 'other'] as const,
    { message: 'Please select a trip interest' }
  ),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferredContact: z.enum(['email', 'phone', 'whatsapp'] as const, {
    message: 'Please select a preferred contact method',
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const tripPlannerSchema = z.object({
  destinations: z
    .array(z.string())
    .min(1, 'Please select at least one destination'),
  experienceTypes: z
    .array(z.string())
    .min(1, 'Please select at least one experience type'),
  budgetTier: z.enum(['budget', 'mid-range', 'luxury', 'ultra-luxury'] as const, {
    message: 'Please select a budget tier',
  }),
  durationPreference: z.string().min(1, 'Please select a duration'),
  groupType: z.string().min(1, 'Please select a group type'),
  preferredMonth: z.number().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export type TripPlannerFormData = z.infer<typeof tripPlannerSchema>;
