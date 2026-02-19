import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://tourlink.africa"),
  title: {
    default: "TourLink — Linking You to the World",
    template: "%s | TourLink — Southern & East Africa Safaris",
  },
  description:
    "Curated safari packages across South Africa, Tanzania, Zimbabwe, Mozambique, and beyond. From budget overland adventures to ultra-luxury fly-in safaris. Plan your dream African holiday today.",
  keywords: [
    "African safari",
    "Southern and East Africa tours",
    "Tanzania safari",
    "Victoria Falls",
    "Zanzibar holidays",
    "Kruger National Park",
    "safari packages",
    "luxury safari",
    "TourLink",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TourLink",
    title: "TourLink — Linking You to the World",
    description:
      "Curated safari packages across Southern and East Africa. From budget adventures to ultra-luxury fly-in safaris.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TourLink — Linking You to the World",
    description:
      "Curated safari packages across Southern and East Africa. From budget adventures to ultra-luxury fly-in safaris.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <ScrollToTop />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  );
}
