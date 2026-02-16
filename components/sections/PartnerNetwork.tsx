import { partners } from '@/data/partners';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PartnerLogo } from '@/components/ui/PartnerLogo';

export function PartnerNetwork() {
  return (
    <>
      {/* Partner Grid */}
      <section className="py-16 md:py-20 bg-white">
        <Container>
          <SectionHeader
            eyebrow="Our Network"
            heading="Award-Winning Local Partners"
            subtext="We work exclusively with vetted, locally owned operators who share our commitment to quality, safety, and sustainability."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="rounded-2xl bg-sand p-6 hover:shadow-card transition-shadow duration-300"
              >
                <PartnerLogo
                  name={partner.name}
                  specialization={partner.country}
                />

                <p className="text-sm text-slate mt-4 leading-relaxed line-clamp-3">
                  {partner.specialization}
                </p>

                {/* Quality Signals */}
                {partner.qualitySignals.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {partner.qualitySignals.slice(0, 2).map((signal) => (
                      <span
                        key={signal}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price Range & Reach */}
                <div className="mt-4 pt-4 border-t border-savanna flex items-center justify-between text-xs text-slate">
                  {partner.priceRange && <span>{partner.priceRange}</span>}
                  <span className="text-ocean font-medium">{partner.regionalReach}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Sustainability Callout */}
      <section className="py-16 md:py-20 bg-olive/10">
        <Container variant="narrow">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-olive/20 mx-auto mb-6">
              <svg className="w-8 h-8 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.592L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-charcoal">
              Committed to Regenerative Travel
            </h2>

            <p className="text-lg text-slate max-w-2xl mx-auto mt-4 leading-relaxed">
              We believe tourism should leave destinations better than it found them. Our partner
              network includes properties and operators leading the charge on sustainable African
              tourism.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="rounded-xl bg-white p-5 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                  <h3 className="text-sm font-bold text-charcoal">Solar-Powered Lodges</h3>
                </div>
                <p className="text-sm text-slate">
                  Partners like ENVI Sisini Mara operate 100% on solar power, proving that luxury
                  and sustainability go hand in hand.
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <h3 className="text-sm font-bold text-charcoal">Community Impact</h3>
                </div>
                <p className="text-sm text-slate">
                  Conservancy partnerships channel tourism revenue directly to local communities,
                  funding schools, clinics, and conservation programmes.
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <h3 className="text-sm font-bold text-charcoal">Carbon Awareness</h3>
                </div>
                <p className="text-sm text-slate">
                  Several partners, including Acacia Adventure, run active carbon-offset programmes
                  to mitigate the environmental impact of travel.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
