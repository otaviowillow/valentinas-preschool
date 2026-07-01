/** Preschool age bounds and inquiry helpers. Defaults match admin settings. */

import { eq } from 'drizzle-orm';
import {
  DEFAULT_AGE_MAX_MONTHS,
  DEFAULT_AGE_MIN_MONTHS,
  formatAgeMonths,
} from './settings';
import type { dbFrom } from '../db';
import { families, inquiries, type Inquiry } from '../db/schema';

export { formatAgeMonths, formatAgeRangeLabel } from './settings';

type Db = ReturnType<typeof dbFrom>;

export const CHILD_AGE_MIN_MONTHS = DEFAULT_AGE_MIN_MONTHS;
export const CHILD_AGE_MAX_MONTHS = DEFAULT_AGE_MAX_MONTHS;

export function isReferralInquiry(inquiry: { intent: string }): boolean {
  return inquiry.intent === 'referral';
}

export function formatChildAgeMonths(months: number): string {
  return formatAgeMonths(months);
}

/** Create or return the family linked to an inquiry (convert shortcut). */
export async function ensureFamilyFromInquiry(
  db: Db,
  inquiry: Inquiry,
  inquiryId: number
): Promise<number> {
  if (inquiry.familyId) return inquiry.familyId;

  const [family] = await db
    .insert(families)
    .values({
      primaryContactName: inquiry.parentName,
      email: inquiry.email,
      phone: inquiry.phone,
      notes: inquiry.message
        ? `From inquiry #${inquiryId}: ${inquiry.message}`
        : `Created from inquiry #${inquiryId}.`,
    })
    .returning({ id: families.id });

  await db
    .update(inquiries)
    .set({ familyId: family.id, updatedAt: new Date() })
    .where(eq(inquiries.id, inquiryId));

  return family.id;
}

type FamilyFormData = {
  primaryContactName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
};

/** Create or update the family record as part of enrollment. */
export async function upsertFamilyForEnroll(
  db: Db,
  inquiry: Inquiry,
  inquiryId: number,
  data: FamilyFormData
): Promise<number> {
  if (inquiry.familyId) {
    await db
      .update(families)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(families.id, inquiry.familyId));
    return inquiry.familyId;
  }

  const [family] = await db
    .insert(families)
    .values(data)
    .returning({ id: families.id });

  await db
    .update(inquiries)
    .set({ familyId: family.id, updatedAt: new Date() })
    .where(eq(inquiries.id, inquiryId));

  return family.id;
}
