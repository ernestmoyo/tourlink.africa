import type { TierLevel, Destination, ExperienceType } from '@/types';

export const TIER_CONFIG: Record<TierLevel, { label: string; color: string; bgColor: string; textColor: string }> = {
  'budget': {
    label: 'Budget',
    color: 'olive',
    bgColor: 'bg-olive',
    textColor: 'text-white',
  },
  'mid-range': {
    label: 'Mid-Range',
    color: 'ocean',
    bgColor: 'bg-ocean',
    textColor: 'text-white',
  },
  'luxury': {
    label: 'Luxury',
    color: 'gold',
    bgColor: 'bg-gold',
    textColor: 'text-charcoal',
  },
  'ultra-luxury': {
    label: 'Ultra-Luxury',
    color: 'magenta',
    bgColor: 'bg-magenta',
    textColor: 'text-white',
  },
};

export const DESTINATION_NAMES: Record<Destination, string> = {
  'south-africa': 'South Africa',
  'tanzania': 'Tanzania',
  'zimbabwe': 'Zimbabwe',
  'mozambique': 'Mozambique',
  'namibia': 'Namibia',
  'botswana': 'Botswana',
  'kenya': 'Kenya',
  'zambia': 'Zambia',
};

export const EXPERIENCE_TYPE_LABELS: Record<ExperienceType, string> = {
  'safari': 'Safari',
  'beach': 'Beach & Island',
  'mountain': 'Mountain Trekking',
  'cultural': 'Cultural & Heritage',
  'bush-and-beach': 'Bush & Beach Combo',
  'overland': 'Overland Adventure',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const NAV_ITEMS = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Packages', href: '/packages' },
  { label: 'Plan Your Trip', href: '/plan-your-trip' },
  { label: 'About', href: '/about' },
] as const;

export const MEAL_LABELS: Record<string, string> = {
  'B': 'Breakfast',
  'L': 'Lunch',
  'D': 'Dinner',
};
