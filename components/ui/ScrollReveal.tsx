'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'left' | 'right' | 'fade';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
  fade: { x: 0, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const offset = offsets[direction];

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
