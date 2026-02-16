import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { destinations } from '@/data/destinations';
import { packages } from '@/data/packages';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { PackageCard } from '@/components/ui/PackageCard';

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) {
    return { title: 'Destination Not Found' };
  }

  return {
    title: destination.name,
    description: `${destination.tagline}. ${destination.description.slice(0, 155)}...`,
  };
}

export default async function DestinationDetailPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) {
    notFound();
  }

  const destinationPackages = packages.filter((pkg) =>
    pkg.destinations.includes(destination.slug)
  );

  const descriptionParagraphs = destination.description.split('\n\n');

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px]">
        <Image
          src={destination.heroImage}
          alt={`${destination.name} — ${destination.tagline}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <Container className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-16">
          <p className="text-sm uppercase tracking-widest font-semibold text-gold mb-3">
            Destination
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
            {destination.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mt-3 max-w-2xl">
            {destination.tagline}
          </p>
        </Container>
      </section>

      {/* Description */}
      <section className="py-16 md:py-20 bg-white">
        <Container variant="narrow">
          <div className="prose prose-lg max-w-none">
            {descriptionParagraphs.map((paragraph, i) => (
              <p key={i} className="text-slate leading-relaxed mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* Key Stats */}
      <section className="py-16 md:py-20 bg-sand">
        <Container>
          <SectionHeader
            eyebrow="At a Glance"
            heading={`${destination.name} Key Facts`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Market Share */}
            {destination.marketShare && (
              <div className="rounded-2xl bg-white p-6 shadow-card">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-navy/10 text-navy mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
                  Market Share
                </h3>
                <p className="text-2xl font-serif text-navy mt-1">
                  {destination.marketShare}
                </p>
              </div>
            )}

            {/* Growth Rate */}
            {destination.growthRate && (
              <div className="rounded-2xl bg-white p-6 shadow-card">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-olive/10 text-olive mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
                  Growth Rate
                </h3>
                <p className="text-2xl font-serif text-olive mt-1">
                  {destination.growthRate}
                </p>
              </div>
            )}

            {/* Key Hubs */}
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-ocean/10 text-ocean mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
                Key Hubs
              </h3>
              <ul className="mt-2 space-y-1">
                {destination.keyHubs.map((hub) => (
                  <li key={hub} className="text-sm text-slate">{hub}</li>
                ))}
              </ul>
            </div>

            {/* Entry Fees */}
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 text-gold mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
                Entry Fees
              </h3>
              <ul className="mt-2 space-y-1">
                {destination.entryFees.slice(0, 2).map((fee) => (
                  <li key={fee} className="text-sm text-slate">{fee}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Signature Experiences */}
      <section className="py-16 md:py-20 bg-white">
        <Container>
          <SectionHeader
            eyebrow="Must-Do"
            heading="Signature Experiences"
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {destination.signatureExperiences.map((experience, i) => (
              <div
                key={experience}
                className="flex items-start gap-4 rounded-xl bg-sand p-5"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-magenta text-white text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-charcoal font-medium pt-1.5">
                  {experience}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery */}
      {destination.galleryImages.length > 0 && (
        <section className="py-16 md:py-20 bg-sand">
          <Container>
            <SectionHeader
              eyebrow="Gallery"
              heading={`${destination.name} in Pictures`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
              {destination.galleryImages.map((image, i) => (
                <div
                  key={image}
                  className={`relative rounded-xl overflow-hidden shadow-card ${
                    i === 0 ? 'sm:col-span-2 sm:row-span-2 aspect-[4/3]' : 'aspect-[3/2]'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${destination.name} gallery image ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes={i === 0 ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Packages */}
      {destinationPackages.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <Container>
            <SectionHeader
              eyebrow="Curated Itineraries"
              heading={`Packages in ${destination.name}`}
              subtext={`Explore our hand-crafted travel packages featuring ${destination.name}.`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {destinationPackages.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-28 bg-navy text-center">
        <Container>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
            Start Planning Your {destination.name} Trip
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mt-4">
            Tell us your dates, budget, and interests. Our Africa specialists will craft a
            bespoke itinerary tailored to you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild href="/plan-your-trip" size="lg">
              Start Planning &rarr;
            </Button>
            <Button asChild href="/contact" variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-navy">
              Talk to a Specialist
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
