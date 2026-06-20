// Single source of truth for site-wide constants.
// Keep the NAP block byte-for-byte consistent with every external listing
// (Google Business Profile, Yelp, etc.) — see README.md §2 (Brand), Canonical NAP.

export const site = {
  name: "Valentina's Preschool",
  shortName: 'Valentina’s',
  tagline:
    'Childhood is not a race. Every child develops at their own pace and grace.',
  description:
    'A boutique, Reggio-inspired preschool in Culver City / West LA. Bilingual (daily Spanish), meals included. Ages 15 months–5 years.',
  // TODO: switch to https://www.valentinaspreschool.com once the domain is live.
  url: 'https://www.valentinaspreschool.com',
  director: 'Valentina Gloginic',
  yearsServing: '14+',

  // Canonical NAP — do not vary formatting.
  nap: {
    streetAddress: '6100 Hargis St',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    postalCode: '90034',
    addressCountry: 'US',
    telephoneDisplay: '(310) 839-9147',
    telephoneHref: '+13108399147',
    email: '', // TODO: confirm a contact email with client
  },

  // Geo areas to target in copy/SEO (not the postal NAP).
  areasServed: ['Culver City', 'West Los Angeles', 'Mid-City', 'Palms', '90034'],

  // Verified facts (some from third-party listings — confirm with client).
  facts: {
    capacity: 12,
    ratio: '1:4',
    ageRange: '15 months – 5 years', // NOTE: sources conflict (15mo–5yr / 17mo–6yr). Confirm.
    hours: '7:30 AM – 6:00 PM, Monday–Friday',
    license: '197417501',
    accreditation: 'NAEYC Member',
    languages: 'English & Spanish',
    mealsIncluded: true,
  },

  // Tuition — figures from a third-party listing; CONFIRM before publishing.
  tuition: {
    weeklyFrom: 350,
    applicationFee: 300,
    siblingDiscount: true,
    subsidiesAccepted: true,
    note: 'Pricing varies by schedule (2, 3, or 5 days). Contact us for current rates.',
  },

  award: {
    title: 'Top 3 Preschool · 2026',
    by: 'BusinessRate',
    detail: 'Mid-City, Los Angeles · powered by Google Reviews',
    // TODO: link to her live BusinessRate ranking page when available.
    href: 'https://businessrate.com/',
  },

  social: {
    instagram: 'https://www.instagram.com/valentinaspreschool/',
    instagramHandle: '@valentinaspreschool',
  },
} as const;

// Primary navigation (lean — the hub-and-spoke deep links live in-page + footer).
export const navLinks = [
  { label: 'Philosophy', href: '/philosophy/' },
  { label: 'Programs', href: '/programs/' },
  { label: 'Enrichment', href: '/enrichment/' },
  { label: 'Educators', href: '/educators/' },
  { label: 'Testimonials', href: '/testimonials/' },
  { label: 'Tuition', href: '/tuition/' },
  { label: 'Contact', href: '/contact/' },
] as const;

// Footer grouping (includes the SEO spoke pages).
export const footerLinks = {
  Approach: [
    { label: 'Our Philosophy', href: '/philosophy/' },
    { label: 'Emotional Literacy', href: '/emotional-literacy/' },
    { label: 'Bilingual / Spanish', href: '/bilingual/' },
    { label: 'Meet Valentina', href: '/educators/' },
  ],
  Programs: [
    { label: 'Programs by Age', href: '/programs/' },
    { label: 'Enrichment', href: '/enrichment/' },
    { label: 'Tuition & FAQ', href: '/tuition/' },
    { label: 'Testimonials', href: '/testimonials/' },
  ],
  Visit: [
    { label: 'Book a Tour', href: '/contact/' },
    { label: 'Contact Us', href: '/contact/' },
    { label: 'Instagram', href: 'https://www.instagram.com/valentinaspreschool/' },
  ],
} as const;
