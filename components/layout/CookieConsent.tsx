'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'tourlink-cookies-accepted';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay so it doesn't flash on page load
    const timer = setTimeout(() => {
      const accepted = localStorage.getItem(STORAGE_KEY);
      if (!accepted) {
        setIsVisible(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(STORAGE_KEY, 'all');
    setIsVisible(false);
  };

  const handleManagePreferences = () => {
    // For now, treat "manage preferences" as accepting essential-only cookies
    localStorage.setItem(STORAGE_KEY, 'essential');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[70] border-t border-savanna bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            {/* Text */}
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-charcoal">
                We use cookies to enhance your browsing experience, serve
                personalised content, and analyse our traffic. By clicking
                &ldquo;Accept All&rdquo;, you consent to our use of cookies.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={handleManagePreferences}
                className="rounded-full border border-slate/30 px-5 py-2 text-sm font-medium text-charcoal transition-all duration-200 hover:border-navy hover:text-navy"
              >
                Manage Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-full bg-magenta px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-magenta-dark active:scale-95"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
