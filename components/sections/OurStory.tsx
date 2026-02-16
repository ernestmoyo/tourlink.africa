import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';

const approachPillars = [
  {
    title: 'Cross-Border Logistics Expertise',
    description:
      'We navigate the visa requirements, border crossings, and transfer logistics that make multi-country itineraries seamless. From the KAZA Univisa to inter-country charter flights, we handle the complexity so you can focus on the experience.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    title: 'Vetted Partner Network',
    description:
      'Every DMC in our network has been personally visited, reviewed, and tested. We work with World Travel Award winners, SATSA-bonded operators, and community-certified guides who share our commitment to quality and safety.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    title: 'Sustainability Commitment',
    description:
      'We champion regenerative tourism that leaves destinations better than we found them. From solar-powered lodges to community conservancy partnerships, every itinerary is designed with the long-term health of Africa\'s ecosystems and communities in mind.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.592L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67" />
      </svg>
    ),
  },
];

export function OurStory() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] max-h-[500px]">
        <Image
          src="/images/about/guide-hero.webp"
          alt="TourLink Africa safari guide"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <Container className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-16">
          <p className="text-sm uppercase tracking-widest font-semibold text-gold mb-3">
            Our Company
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
            About TourLink
          </h1>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20 bg-white">
        <Container variant="narrow">
          <SectionHeader
            eyebrow="Who We Are"
            heading="Our Story"
            align="left"
          />

          <div className="mt-8 space-y-6 text-slate leading-relaxed">
            <p>
              TourLink was born from a simple frustration: planning a multi-country African safari
              shouldn&apos;t require a PhD in logistics. Founded by travel professionals with deep
              roots across Southern and East Africa, we set out to build the bridge between
              world-class local operators and the travellers who deserve access to their expertise.
            </p>

            <p>
              Our founding team spent years on the ground in Tanzania, Zimbabwe, South Africa, and
              Mozambique, building relationships with the guides, lodge owners, and community leaders
              who form the backbone of African tourism. We saw first-hand how fragmented the booking
              experience was — different operators for each country, inconsistent quality standards,
              and a lack of coordination that turned what should be a seamless journey into a
              logistical puzzle. TourLink was our answer.
            </p>

            <p>
              Today, we connect travellers with a curated network of award-winning destination
              management companies (DMCs) across eight countries. Every partner in our network has
              been personally vetted for quality, safety, sustainability, and value. Whether
              you&apos;re a first-time safari-goer seeking the Big Five in the Kruger, an adventure
              seeker summiting Kilimanjaro, or a honeymoon couple chasing barefoot luxury on
              Mozambique&apos;s islands — we architect the journey and our partners deliver the
              experience.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Approach */}
      <section className="py-16 md:py-20 bg-sand">
        <Container>
          <SectionHeader
            eyebrow="Our Philosophy"
            heading="We Don't Just Sell Safaris. We Architect Journeys."
            subtext="Three pillars guide every itinerary we create — from budget overland adventures to ultra-luxury fly-in circuits."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {approachPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl bg-white p-8 shadow-card"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-navy/10 text-navy mb-5">
                  {pillar.icon}
                </div>

                <h3 className="text-xl font-serif text-charcoal">
                  {pillar.title}
                </h3>

                <p className="text-slate mt-3 leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
