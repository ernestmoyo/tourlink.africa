'use client';

import { useState, useEffect } from 'react';

interface ScrollDirectionState {
  scrollDirection: 'up' | 'down';
  isAtTop: boolean;
  scrollY: number;
}

const THRESHOLD = 5;

export function useScrollDirection(): ScrollDirectionState {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      // Update isAtTop
      setIsAtTop(currentScrollY < 10);
      setScrollY(currentScrollY);

      // Only change direction if we've scrolled more than the threshold
      const diff = Math.abs(currentScrollY - lastScrollY);
      if (diff < THRESHOLD) {
        ticking = false;
        return;
      }

      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { scrollDirection, isAtTop, scrollY };
}
