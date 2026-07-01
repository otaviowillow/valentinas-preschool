// Shared SEO constants and helpers for public pages.

import type { SiteSettings } from './settings';
import { formatAgeRangeLabel } from './settings';
import { site } from '../data/site';

/** Approximate coordinates for 6100 Hargis St, Los Angeles CA 90034. */
export const SCHOOL_GEO = {
  latitude: 34.0175,
  longitude: -118.407,
} as const;

export const OG_IMAGE_PATH = '/valentina.jpg';

export function siteDescription(settings: SiteSettings): string {
  const ages = formatAgeRangeLabel(settings.ageMinMonths, settings.ageMaxMonths);
  return `A boutique, Reggio-inspired preschool in Culver City / West LA. Bilingual (daily Spanish), meals included. Ages ${ages}.`;
}

export interface FaqItem {
  q: string;
  a: string;
  preline?: boolean;
}

/** Tuition-page FAQs including local + age queries for schema and on-page SEO. */
export function tuitionFaqs(settings: SiteSettings): FaqItem[] {
  const ages = formatAgeRangeLabel(settings.ageMinMonths, settings.ageMaxMonths);
  const areas = site.areasServed.join(', ');

  const faqs: FaqItem[] = [
    {
      q: 'What ages do you accept?',
      a: `We welcome children ages ${ages}.`,
    },
    {
      q: 'What areas do you serve?',
      a: `We’re at ${site.nap.streetAddress} in Palms (${site.nap.postalCode}), on the Culver City border. Families join us from ${areas}, and across West Los Angeles.`,
    },
    {
      q: 'Is this a daycare or a preschool?',
      a: 'Both, depending on your child’s age. We offer a warm, home-like childcare setting for toddlers and a Reggio-inspired preschool program for older children — daily Spanish, meals, and enrichment included in one tuition.',
    },
    {
      q: 'What are your hours?',
      a: `We’re open ${site.facts.hours}.`,
    },
    {
      q: 'How much is tuition?',
      a: `Tuition starts at $${settings.weeklyFrom} per week for full-time (5 days) and varies by schedule. There is a one-time $${settings.applicationFee} application fee. ${settings.tuitionNote}`,
    },
    {
      q: 'Are meals included?',
      a: 'Yes. Nutritious breakfast, lunch, and an afternoon snack are included every day. No cold lunchbox required.',
    },
    {
      q: 'Do you offer a sibling discount?',
      a: settings.siblingDiscount
        ? `Yes. ${settings.siblingDiscountNote}`
        : 'Please contact us about current pricing.',
    },
    {
      q: 'Do you accept childcare subsidies?',
      a: settings.subsidiesAccepted
        ? 'Yes, we accept childcare subsidies. Reach out and we’ll walk you through it.'
        : 'Please contact us to discuss payment options.',
    },
    {
      q: 'What is enrichment going to cost extra?',
      a: 'Nothing. Spanish, music & dance, yoga, gardening, cooking, and art are all included in tuition.',
    },
  ];

  return faqs;
}

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
