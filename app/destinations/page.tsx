import type { Metadata } from 'next';
import { destinations } from '@/data/destinations';
import { Container } from '@/components/ui/Container';
import { DestinationFeature } from '@/components/sections/DestinationFeature';
import { CrossBorderCallout } from '@/components/sections/CrossBorderCallout';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Explore safari destinations across Southern and East Africa. From South Africa and Tanzania to Zimbabwe, Mozambique, Namibia, Botswana, Kenya, and Zambia.',
};

export default function DestinationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('/images/heroes/safari-sunset.jpg')] bg-cover bg-center opacity-20" />
        <Container className="relative z-10 text-center">
          <p className="text-sm uppercase tracking-widest font-semibold text-gold mb-4">
            8 Countries, Endless Possibilities
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white max-w-4xl mx-auto">
            Where Will Your Journey Take You?
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mt-6">
            From the Serengeti&apos;s endless plains to the turquoise waters of the Bazaruto Archipelago,
            discover the destinations that make Southern and East Africa the world&apos;s premier safari region.
          </p>
        </Container>
      </section>

      {/* Destination Features */}
      <section className="bg-white">
        <Container>
          {destinations.map((destination, index) => (
            <DestinationFeature
              key={destination.slug}
              destination={destination}
              index={index}
              reversed={index % 2 !== 0}
            />
          ))}
        </Container>
      </section>

      {/* Cross-Border Routes */}
      <CrossBorderCallout />
    </>
  );
}
