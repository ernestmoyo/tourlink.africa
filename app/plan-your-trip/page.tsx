import { Container } from '@/components/ui/Container';
import { TripWizard } from '@/components/forms/TripWizard';

export default function PlanYourTripPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 sm:py-20 lg:py-24">
        <Container variant="narrow" className="text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Plan Your Dream Safari
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Answer a few questions and we&apos;ll recommend the perfect journey
            for you. Our travel designers will craft a personalised itinerary
            within 48 hours.
          </p>
        </Container>
      </section>

      {/* Wizard */}
      <section className="py-12 sm:py-16 lg:py-20 bg-savanna/20">
        <Container variant="default">
          <TripWizard />
        </Container>
      </section>
    </>
  );
}
