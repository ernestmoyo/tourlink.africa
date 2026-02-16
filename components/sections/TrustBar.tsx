'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { Container } from '@/components/ui';

interface StatProps {
  target: number;
  suffix: string;
  prefix?: string;
  label: string;
  shouldStart: boolean;
  decimals?: number;
}

function Stat({ target, suffix, prefix = '', label, shouldStart, decimals = 0 }: StatProps) {
  const rawTarget = decimals > 0 ? target * Math.pow(10, decimals) : target;
  const count = useCountUp(rawTarget, 2000, shouldStart);
  const display = decimals > 0
    ? (count / Math.pow(10, decimals)).toFixed(decimals)
    : count;

  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold font-serif">
        {prefix}{display}{suffix}
      </p>
      <p className="text-white/70 text-sm mt-1 font-sans">{label}</p>
    </div>
  );
}

export function TrustBar() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="bg-navy text-white py-8">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat target={8} suffix="" label="Countries" shouldStart={isInView} />
          <Stat target={50} suffix="+" label="Packages" shouldStart={isInView} />
          <Stat target={12} suffix="" label="Award-Winning Partners" shouldStart={isInView} />
          <Stat target={132} suffix="B" prefix="$" label="Market" shouldStart={isInView} decimals={1} />
        </div>
      </Container>
    </section>
  );
}
