'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection();
  const pathname = usePathname();

  const isHidden = scrollDirection === 'down' && !isAtTop;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
          // Background
          isAtTop
            ? 'bg-transparent'
            : 'bg-navy shadow-nav',
          // Smart-hide
          isHidden ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex-shrink-0"
            aria-label="TourLink - Home"
          >
            <Image
              src="/images/logo.png"
              alt="TourLink"
              width={160}
              height={48}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors duration-200',
                    'text-white hover:text-magenta-light',
                    isActive && 'text-magenta-light'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-magenta-light" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA + Mobile Hamburger */}
          <div className="flex items-center gap-4">
            {/* Enquire Now - Desktop */}
            <Link
              href="/plan-your-trip"
              className={cn(
                'hidden rounded-full bg-magenta px-6 py-2.5 text-sm font-semibold text-white',
                'transition-all duration-200 hover:bg-magenta-dark hover:shadow-lg',
                'active:scale-95',
                'lg:inline-flex'
              )}
            >
              Enquire Now
            </Link>

            {/* Hamburger Button - Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className={cn(
                'relative z-10 flex h-10 w-10 items-center justify-center rounded-lg',
                'text-white transition-colors duration-200 hover:bg-white/10',
                'lg:hidden'
              )}
              aria-label="Open navigation menu"
              aria-expanded={isMobileNavOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
