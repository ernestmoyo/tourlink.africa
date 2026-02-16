# TourLink Africa

**Linking you to the World** — Curated safari and holiday experiences across Southern and East Africa.

## About

TourLink is a travel agency connecting travellers with vetted local operators for authentic African experiences across 8 countries: Tanzania, South Africa, Zimbabwe, Mozambique, Namibia, Botswana, Kenya, and Zambia.

From budget overland adventures to ultra-luxury fly-in safaris, we architect seamless multi-country journeys through Africa's most iconic destinations.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, TypeScript)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Fonts:** Playfair Display (serif) + Plus Jakarta Sans (sans)
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
tourlink/
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── blog/               # Blog (coming soon)
│   ├── contact/            # Contact page with form
│   ├── destinations/       # Destination hub + [slug] detail pages
│   ├── packages/           # Package hub + [slug] detail pages
│   ├── plan-your-trip/     # Multi-step trip planner wizard
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── forms/              # ContactForm, TripWizard
│   ├── layout/             # Header, Footer, MobileNav
│   ├── sections/           # Page section components
│   └── ui/                 # Reusable design system primitives
├── data/                   # Typed content data (CMS-ready)
│   ├── destinations.ts     # 8 country profiles
│   ├── packages.ts         # 12 safari packages
│   ├── partners.ts         # 9 DMC partners
│   ├── properties.ts       # Luxury property spotlights
│   └── site.ts             # Site config, offices, contacts
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, schemas, metadata helpers
├── public/images/          # Optimised images
└── types/                  # TypeScript interfaces
```

## Features

- 12 curated safari packages with full day-by-day itineraries
- 8 destination country profiles with entry fees, key hubs, and experiences
- Interactive trip planner wizard (8-step form)
- Responsive design optimised for mobile, tablet, and desktop
- SEO: JSON-LD schemas, dynamic sitemap, robots.txt, full Open Graph metadata
- Scroll-triggered animations and interactive carousels

## Sister Company

[Visa Permit Link](https://visapermitlink.com/) — Visa and permit application services for Southern and East Africa travel.

## Live Site

[www.tourlink.africa](https://www.tourlink.africa)
