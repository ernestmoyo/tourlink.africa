'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-navy"
            aria-label="Mobile navigation"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <div className="flex h-20 items-center justify-end px-4 sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors duration-200 hover:bg-white/10"
                aria-label="Close navigation menu"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
              {NAV_ITEMS.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'block px-4 py-3 text-center font-serif text-3xl font-bold transition-colors duration-200',
                        isActive
                          ? 'text-magenta-light'
                          : 'text-white hover:text-magenta-light'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Section: CTA + Contact */}
            <div className="flex flex-col items-center gap-6 px-6 pb-12">
              <Link
                href="/plan-your-trip"
                onClick={onClose}
                className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-magenta px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-magenta-dark active:scale-95"
              >
                Enquire Now
              </Link>

              <a
                href="tel:+255767898469"
                className="flex items-center gap-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                +255 767 898 469
              </a>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
