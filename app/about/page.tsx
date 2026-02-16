import type { Metadata } from 'next';
import { OurStory } from '@/components/sections/OurStory';
import { PartnerNetwork } from '@/components/sections/PartnerNetwork';

export const metadata: Metadata = {
  title: 'About TourLink',
  description:
    'Learn about TourLink — our story, our approach to curated African travel, and our network of award-winning local partners across Southern and East Africa.',
};

export default function AboutPage() {
  return (
    <>
      <OurStory />
      <PartnerNetwork />
    </>
  );
}
