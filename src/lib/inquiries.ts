/** Preschool serves ages 15 months – 5 years (see site.ts ageRange). */
export const CHILD_AGE_MIN_MONTHS = 15;
export const CHILD_AGE_MAX_MONTHS = 60;

export function isReferralInquiry(inquiry: { intent: string }): boolean {
  return inquiry.intent === 'referral';
}

export function formatChildAgeMonths(months: number): string {
  if (months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? '1 year' : `${years} years`;
  }
  return `${months} months`;
}
