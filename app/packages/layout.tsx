import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Safari Packages',
  description:
    'Browse our curated collection of safari and travel packages across Southern and East Africa. From budget overland adventures to ultra-luxury fly-in safaris — find your perfect African journey.',
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
