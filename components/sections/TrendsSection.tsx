import { Container, SectionHeader } from '@/components/ui';

interface Trend {
  number: string;
  title: string;
  description: string;
}

const trends: Trend[] = [
  {
    number: '01',
    title: 'Ultra-Luxury Expansion',
    description:
      'Private villas and exclusive-access experiences are redefining what safari means.',
  },
  {
    number: '02',
    title: 'Regenerative Travel',
    description:
      '100% solar-powered camps and community-first operations are the new standard.',
  },
  {
    number: '03',
    title: 'The KAZA Corridor',
    description:
      'The $50 Univisa is unlocking seamless Zimbabwe-Zambia-Botswana itineraries.',
  },
];

export function TrendsSection() {
  return (
    <section className="py-20 bg-navy text-white">
      <Container>
        <SectionHeader
          eyebrow="2026 Trends"
          heading="The Future of Safari Travel"
          className="mb-12 [&_h2]:text-white [&_p:first-child]:text-magenta-light"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trends.map((trend) => (
            <div
              key={trend.number}
              className="bg-white/10 backdrop-blur rounded-2xl p-8"
            >
              <span className="text-5xl font-bold font-serif text-gold">
                {trend.number}
              </span>
              <h3 className="font-serif text-xl text-white mt-4 mb-3">
                {trend.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {trend.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
