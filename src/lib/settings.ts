// Public-site settings, editable from /admin/settings. Reads the single
// settings row (id = 1) and falls back to the static defaults in
// src/data/site.ts. Wrapped in try/catch so a public page never 500s if the
// settings table hasn't been migrated yet.

import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../db';
import { site } from '../data/site';

export const DEFAULT_AGE_MIN_MONTHS = 15;
export const DEFAULT_AGE_MAX_MONTHS = 60;

export interface SiteSettings {
  capacity: number;
  weeklyFrom: number;
  applicationFee: number;
  partTimeLabel: string;
  partTimePrice: string;
  partTimeNote: string;
  fullTimeLabel: string;
  fullTimeNote: string;
  siblingDiscount: boolean;
  subsidiesAccepted: boolean;
  ageMinMonths: number;
  ageMaxMonths: number;
  tuitionNote: string;
  siblingDiscountNote: string;
  referralEnabled: boolean;
  referralTitle: string;
  referralBody: string;
}

/** Human label for a single age in months (e.g. 15 → "15 months", 60 → "5 years"). */
export function formatAgeMonths(months: number): string {
  if (months >= 24 && months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? '1 year' : `${years} years`;
  }
  return months === 1 ? '1 month' : `${months} months`;
}

/** Display range for marketing copy (e.g. "15 months – 5 years"). */
export function formatAgeRangeLabel(minMonths: number, maxMonths: number): string {
  return `${formatAgeMonths(minMonths)} – ${formatAgeMonths(maxMonths)}`;
}

export function defaultSettings(): SiteSettings {
  return {
    capacity: site.facts.capacity,
    weeklyFrom: site.tuition.weeklyFrom,
    applicationFee: site.tuition.applicationFee,
    partTimeLabel: 'Part-time',
    partTimePrice: 'Contact us',
    partTimeNote: '2 or 3 days / week',
    fullTimeLabel: 'Full-time',
    fullTimeNote: '5 days / week, full day',
    siblingDiscount: site.tuition.siblingDiscount,
    subsidiesAccepted: site.tuition.subsidiesAccepted,
    ageMinMonths: DEFAULT_AGE_MIN_MONTHS,
    ageMaxMonths: DEFAULT_AGE_MAX_MONTHS,
    tuitionNote: site.tuition.note,
    siblingDiscountNote: 'Please contact us for sibling discount details.',
    referralEnabled: true,
    referralTitle: 'Refer a family, you both win',
    referralBody:
      'Know a family who would love it here? When they enroll, your application fee is waived and your first week is free.',
  };
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const db = dbFrom();
    const [row] = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.id, 1));
    if (!row) return defaultSettings();
    return {
      capacity: row.capacity,
      weeklyFrom: row.weeklyFrom,
      applicationFee: row.applicationFee,
      partTimeLabel: row.partTimeLabel,
      partTimePrice: row.partTimePrice,
      partTimeNote: row.partTimeNote,
      fullTimeLabel: row.fullTimeLabel,
      fullTimeNote: row.fullTimeNote,
      siblingDiscount: row.siblingDiscount,
      subsidiesAccepted: row.subsidiesAccepted,
      ageMinMonths: row.ageMinMonths,
      ageMaxMonths: row.ageMaxMonths,
      tuitionNote: row.tuitionNote,
      siblingDiscountNote: row.siblingDiscountNote,
      referralEnabled: row.referralEnabled,
      referralTitle: row.referralTitle,
      referralBody: row.referralBody,
    };
  } catch {
    return defaultSettings();
  }
}
