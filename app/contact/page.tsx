import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/forms/ContactForm';
import { OfficeLocations } from '@/components/sections/OfficeLocations';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with TourLink to plan your dream African safari. Our specialists are ready to craft a bespoke itinerary across Southern and East Africa.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 md:py-28">
        <Container className="text-center">
          <p className="text-sm uppercase tracking-widest font-semibold text-gold mb-4">
            Let&apos;s Talk
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white max-w-3xl mx-auto">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mt-4">
            Whether you&apos;re dreaming of a Big Five safari, a Kilimanjaro summit, or a
            barefoot beach escape — our Africa specialists are here to help you plan every detail.
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-sand">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-charcoal mb-2">
                Send Us an Inquiry
              </h2>
              <p className="text-slate mb-8">
                Fill in the form below and we&apos;ll get back to you within 24 hours with a tailored response.
              </p>
              <div className="rounded-2xl bg-white p-6 md:p-8 shadow-card">
                <ContactForm />
              </div>
            </div>

            {/* Right: Office Locations + Sister Company */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-charcoal mb-2">
                  Our Offices
                </h2>
                <p className="text-slate mb-8">
                  With offices across three countries, we&apos;re always close to your next adventure.
                </p>
                <OfficeLocations />
              </div>

              {/* Sister Company Callout */}
              <div className="rounded-2xl bg-navy p-6 md:p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Need a Visa?</h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  Our sister company <strong>{siteConfig.sisterCompany.name}</strong> handles
                  visa and permit applications for Southern and East Africa travel, ensuring a smooth
                  entry to every destination.
                </p>
                <Link
                  href={siteConfig.sisterCompany.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-gold hover:text-gold-light transition-colors duration-200"
                >
                  Visit {siteConfig.sisterCompany.name}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
