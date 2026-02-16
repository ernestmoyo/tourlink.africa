import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';

const crossBorderRoutes = [
  {
    title: 'The KAZA Corridor',
    description:
      'Zimbabwe + Zambia + Botswana. The $50 Univisa unlocks seamless cross-border day trips from Victoria Falls.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    title: 'Bush & Beach',
    description:
      'Kruger + Bazaruto Archipelago. Combine Big Five safaris with pristine Indian Ocean beaches.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    title: 'The Great Migration Circuit',
    description:
      'Serengeti + Ngorongoro + Zanzibar. Follow the wildebeest, explore the crater, relax on the beach.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.592L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67" />
      </svg>
    ),
  },
];

export function CrossBorderCallout() {
  return (
    <section className="bg-savanna py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="Multi-Country Adventures"
          heading="Cross-Border Journeys"
          subtext="Our most popular routes connect the best of Southern and East Africa into seamless multi-country itineraries."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {crossBorderRoutes.map((route) => (
            <Link
              key={route.title}
              href="/packages"
              className="group block rounded-2xl bg-white p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-navy/10 text-navy mb-5 group-hover:bg-navy group-hover:text-white transition-colors duration-300">
                {route.icon}
              </div>

              <h3 className="text-xl font-serif text-charcoal group-hover:text-navy transition-colors duration-200">
                {route.title}
              </h3>

              <p className="text-slate mt-3 leading-relaxed">
                {route.description}
              </p>

              <span className="inline-block mt-5 text-sm font-semibold text-magenta group-hover:text-magenta-dark transition-colors duration-200">
                Learn More &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
