import {
  HeroSection,
  TrustBar,
  DestinationShowcase,
  FeaturedPackages,
  WhyTourLink,
  LuxurySpotlight,
  TestimonialsSection,
  TrendsSection,
  NewsletterCTA,
} from '@/components/sections';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <DestinationShowcase />
      <FeaturedPackages />
      <WhyTourLink />
      <LuxurySpotlight />
      <TestimonialsSection />
      <TrendsSection />
      <NewsletterCTA />
    </>
  );
}
