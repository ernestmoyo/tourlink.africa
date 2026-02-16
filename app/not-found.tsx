import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      {/* Hero with background image */}
      <section className="relative min-h-[60vh] flex items-center justify-center">
        {/* Background image */}
        <Image
          src="/images/heroes/serengeti-lion.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-navy/70" aria-hidden="true" />

        <Container className="relative z-10 text-center py-20">
          <p className="text-8xl md:text-9xl font-serif font-bold text-white/20 mb-4">
            404
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
            Trail Not Found
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10">
            Looks like this path leads deeper into the bush than we expected.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild href="/" variant="primary" size="lg">
              Back to Homepage
            </Button>
            <Button asChild href="/packages" variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-navy">
              Explore Packages
            </Button>
          </div>
        </Container>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-sand">
        <Container variant="narrow">
          <h2 className="text-2xl font-serif text-charcoal text-center mb-8">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Destinations', href: '/destinations' },
              { label: 'Safari Packages', href: '/packages' },
              { label: 'Plan Your Trip', href: '/plan-your-trip' },
              { label: 'About Us', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Blog', href: '/blog' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl bg-white px-4 py-5 text-sm font-semibold text-navy hover:bg-navy hover:text-white transition-colors shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
