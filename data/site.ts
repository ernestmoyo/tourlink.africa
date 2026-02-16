import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'TourLink',
  tagline: 'Linking you to the World',
  description:
    'Curated safari packages across South Africa, Tanzania, Zimbabwe, Mozambique, and beyond. TourLink connects travellers with vetted local operators for authentic African experiences — from budget overland adventures to ultra-luxury fly-in safaris.',
  url: 'https://tourlink.africa',
  offices: [
    {
      city: 'Dar es Salaam',
      country: 'Tanzania',
      address: '158 Block K, JDM Building, Mbezi Beach, Dar es Salaam',
      phones: ['+255 767 898 469'],
      isHQ: true,
    },
    {
      city: 'Harare',
      country: 'Zimbabwe',
      address: '11 Phillips Ave Belgravia, Harare',
      phones: ['+263 242 794 183', '+263 772 928 431'],
    },
    {
      city: 'Sandton',
      country: 'South Africa',
      address: '1st Floor, Falcon Hse, 31 Wessel Rd, Edenburg, Sandton',
      phones: ['+27 82 609 1045'],
    },
    {
      city: 'Cape Town',
      country: 'South Africa',
      address: '50 Long Street, Cape Town, WC 8001',
      phones: ['+27 21 013 3085'],
    },
  ],
  sisterCompany: {
    name: 'Visa Permit Link',
    url: 'https://visapermitlink.com/',
    description: 'Visa and permit services for Southern and East Africa travel',
  },
  socialLinks: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    linkedin: '#',
    whatsapp: 'https://wa.me/255767898469',
  },
  operatingHours: 'Mon-Fri 8am-6pm EAT, Sat 9am-1pm',
};
