import Link from 'next/link';
import Image from 'next/image';
import { DESTINATION_NAMES } from '@/lib/constants';
import type { Destination } from '@/types';

const QUICK_LINKS = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Packages', href: '/packages' },
  { label: 'Plan Your Trip', href: '/plan-your-trip' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
] as const;

const DESTINATIONS: { slug: Destination; name: string }[] = Object.entries(
  DESTINATION_NAMES
).map(([slug, name]) => ({ slug: slug as Destination, name }));

const OFFICES = [
  {
    city: 'Dar es Salaam',
    label: 'HQ',
    address: '158 Block K, JDM Building, Mbezi Beach, Dar es Salaam',
    phones: ['+255 767 898 469'],
  },
  {
    city: 'Harare',
    label: null,
    address: '11 Phillips Ave Belgravia',
    phones: ['+263 242 794 183', '+263 772 928 431'],
  },
  {
    city: 'Sandton',
    label: null,
    address: '1st Floor, Falcon Hse, 31 Wessel Rd, Edenburg, Sandton',
    phones: ['+27 82 609 1045'],
  },
  {
    city: 'Cape Town',
    label: null,
    address: '50 Long Street, WC 8001',
    phones: ['+27 21 013 3085'],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-navy text-white" role="contentinfo">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="TourLink - Home">
              <Image
                src="/images/logo.png"
                alt="TourLink"
                width={180}
                height={54}
                className="h-auto w-[180px]"
              />
            </Link>
            <p className="mt-4 font-serif text-lg italic text-sand">
              Linking you to the World
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              TourLink curates unforgettable safari and travel experiences across
              Southern and East Africa. From budget overland adventures to
              ultra-luxury fly-in safaris, we connect you to the best the
              continent has to offer.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-magenta-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Destinations
            </h3>
            <ul className="mt-4 space-y-2.5">
              {DESTINATIONS.map((dest) => (
                <li key={dest.slug}>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="text-sm text-white/70 transition-colors duration-200 hover:text-magenta-light"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Contact Us
            </h3>
            <div className="mt-4 space-y-4">
              {OFFICES.map((office) => (
                <div key={office.city}>
                  <p className="text-sm font-semibold text-sand">
                    {office.city}
                    {office.label && (
                      <span className="ml-1.5 rounded bg-magenta/20 px-1.5 py-0.5 text-xs font-medium text-magenta-light">
                        {office.label}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                    {office.address}
                  </p>
                  {office.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="mt-0.5 block text-xs text-white/60 transition-colors duration-200 hover:text-magenta-light"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              ))}

              {/* Operating Hours */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-semibold text-sand">
                  Operating Hours
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Mon&ndash;Fri: 8am&ndash;6pm EAT
                </p>
                <p className="text-xs text-white/60">
                  Sat: 9am&ndash;1pm
                </p>
              </div>

              {/* Sister Company */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-semibold text-sand">
                  Sister Company
                </p>
                <a
                  href="https://visapermitlink.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-white/60 transition-colors duration-200 hover:text-magenta-light"
                >
                  Visa Permit Link &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} TourLink. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="text-xs text-white/60 transition-colors duration-200 hover:text-magenta-light"
            >
              Privacy Policy
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href="/terms-and-conditions"
              className="text-xs text-white/60 transition-colors duration-200 hover:text-magenta-light"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
