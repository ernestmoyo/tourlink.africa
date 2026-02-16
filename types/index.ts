export type TierLevel = 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury';

export type Destination =
  | 'south-africa'
  | 'tanzania'
  | 'zimbabwe'
  | 'mozambique'
  | 'namibia'
  | 'botswana'
  | 'kenya'
  | 'zambia';

export type ExperienceType =
  | 'safari'
  | 'beach'
  | 'mountain'
  | 'cultural'
  | 'bush-and-beach'
  | 'overland';

export type Season = 'peak' | 'shoulder' | 'green';
export type MealPlan = 'B' | 'L' | 'D';

export interface Package {
  slug: string;
  name: string;
  tier: TierLevel;
  destinations: Destination[];
  experienceTypes: ExperienceType[];
  durationDays: number;
  durationNights: number;
  routeSummary: string;
  shortDescription: string;
  fullDescription: string;
  priceFrom: number;
  priceTo?: number;
  priceUnit: 'per-person' | 'per-person-per-night';
  seasonalPricing?: Record<Season, { from: number; to?: number }>;
  groupSizeMin: number;
  groupSizeMax: number;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  bestMonths: number[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
  heroImage: string;
  galleryImages: string[];
  targetSegments: string[];
  featured: boolean;
  partnerDMCs: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  accommodation?: string;
  meals: MealPlan[];
  activities: string[];
  destination: Destination;
  transferNote?: string;
}

export interface DestinationInfo {
  slug: Destination;
  name: string;
  tagline: string;
  description: string;
  marketShare?: string;
  growthRate?: string;
  keyHubs: string[];
  signatureExperiences: string[];
  entryFees: string[];
  regulatoryNotes: string[];
  heroImage: string;
  galleryImages: string[];
}

export interface Partner {
  name: string;
  country: string;
  specialization: string;
  priceRange?: string;
  qualitySignals: string[];
  regionalReach: string;
  logo?: string;
  website?: string;
}

export interface LuxuryProperty {
  name: string;
  location: string;
  country: Destination;
  openingDate: string;
  rateFrom?: number;
  rateTo?: number;
  rateUnit?: string;
  edge: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  trip: string;
  rating: number;
  quote: string;
  avatar?: string;
  isPlaceholder?: boolean;
}

export interface TripPlannerSubmission {
  destinations: Destination[];
  experienceTypes: ExperienceType[];
  budgetTier: TierLevel;
  durationPreference: string;
  groupType: string;
  preferredMonth?: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface Office {
  city: string;
  country: string;
  address: string;
  phones: string[];
  isHQ?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  offices: Office[];
  sisterCompany: {
    name: string;
    url: string;
    description: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  operatingHours: string;
}

export interface TrendItem {
  title: string;
  description: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
