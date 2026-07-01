// Public-site settings, editable from /admin/settings. Reads the single
// settings row (id = 1) and falls back to the static defaults in
// src/data/site.ts. Wrapped in try/catch so a public page never 500s if the
// settings table hasn't been migrated yet.

import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../db';
import { site } from '../data/site';

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
  holidayScheduleTitle: string;
  holidayScheduleIntro: string;
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
    holidayScheduleTitle: 'Holiday schedule for October 2024 – October 2025',
    holidayScheduleIntro:
      'The school will be closed on the following days for holidays and vacation. Tuition is required year-round.',
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
      holidayScheduleTitle:
        row.holidayScheduleTitle ?? defaultSettings().holidayScheduleTitle,
      holidayScheduleIntro:
        row.holidayScheduleIntro ?? defaultSettings().holidayScheduleIntro,
    };
  } catch {
    return defaultSettings();
  }
}
