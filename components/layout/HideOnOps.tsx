'use client';

import { usePathname } from 'next/navigation';

// Hides the public marketing chrome (header, footer, floating buttons) on the
// internal /ops CRM routes and the traveller /trip portal, which have their own
// minimal branded shells.
export function HideOnOps({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/ops') || pathname?.startsWith('/trip')) return null;
  return <>{children}</>;
}
