'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for animated count-up using requestAnimationFrame.
 * Uses an ease-out curve (starts fast, slows down).
 *
 * @param target  - The final number to count up to
 * @param duration - Animation duration in milliseconds
 * @param shouldStart - Whether the animation should begin
 * @returns The current animated number (integer)
 */
export function useCountUp(target: number, duration: number = 2000, shouldStart: boolean = false): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    startTimeRef.current = null;

    function animate(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out: starts fast, slows down (1 - (1 - t)^3)
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCurrent(Math.round(easedProgress * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, shouldStart]);

  return current;
}
