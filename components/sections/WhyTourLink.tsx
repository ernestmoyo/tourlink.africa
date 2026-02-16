import { Container, SectionHeader } from '@/components/ui';

interface ValueProp {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const valueProps: ValueProp[] = [
  {
    title: 'Seamless Cross-Border Logistics',
    description:
      'From the $50 KAZA Univisa to charter flights and multi-country handoffs, we eliminate the friction of crossing borders so you can focus on the experience. Every transfer, permit, and connection is pre-arranged.',
    icon: (
      <svg
        className="h-10 w-10 text-magenta"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'Award-Winning Local Partners',
    description:
      'Every operator in our network is vetted, accredited, and locally rooted. From Tanzania\'s top-rated safari outfitters to Mozambique\'s coastal specialists, our DMC partners deliver consistent quality on the ground.',
    icon: (
      <svg
        className="h-10 w-10 text-magenta"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Exclusive Access',
    description:
      'Private crater-floor descents before the crowds, villa-only reserves, and invite-only migration camps. Our partnerships unlock experiences that aren\'t available through standard booking channels.',
    icon: (
      <svg
        className="h-10 w-10 text-magenta"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    ),
  },
];

export function WhyTourLink() {
  return (
    <section className="py-20 bg-sand">
      <Container>
        <SectionHeader
          eyebrow="Why Choose Us"
          heading="The TourLink Difference"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {valueProps.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6">
                {prop.icon}
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-3">
                {prop.title}
              </h3>
              <p className="text-slate leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
