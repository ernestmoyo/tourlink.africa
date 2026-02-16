import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plan Your Safari | Custom Trip Planner',
  description:
    'Use our step-by-step trip planner to build your dream African safari. Choose destinations, budget, duration, and travel style — we will craft a personalised itinerary within 48 hours.',
  openGraph: {
    title: 'Plan Your Safari | Custom Trip Planner',
    description:
      'Use our step-by-step trip planner to build your dream African safari. Choose destinations, budget, duration, and travel style.',
  },
};

export default function PlanYourTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
