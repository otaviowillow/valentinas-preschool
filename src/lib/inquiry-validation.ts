import { z } from 'zod';

export const PUBLIC_INQUIRY_MAX_MONTHS = 48;

const trimOrEmpty = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value == null ? '' : value;

const emptyToUndefined = (value: unknown) => {
  const trimmed = trimOrEmpty(value);
  return trimmed === '' ? undefined : trimmed;
};

const formatAgeMonths = (months: number) => {
  if (months >= 24 && months % 12 === 0) {
    const years = months / 12;
    return years === 1 ? '1 year' : `${years} years`;
  }
  return months === 1 ? '1 month' : `${months} months`;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function createInquiryInput(minMonths: number, maxMonths: number) {
  const inquiryMaxMonths = Math.min(maxMonths, PUBLIC_INQUIRY_MAX_MONTHS);

  return z.object({
    parentName: z.preprocess(
      trimOrEmpty,
      z
        .string()
        .min(1, 'Your name is required')
        .max(100)
        .regex(/^[\p{L}\s'.-]+$/u, 'Use letters only in names')
    ),
    email: z.preprocess(
      trimOrEmpty,
      z.string().email('Enter a valid email address').max(200)
    ),
    phone: z.preprocess(
      trimOrEmpty,
      z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number')
    ),
    childAge: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number({ error: 'Enter your child’s age in months' })
        .int()
        .min(minMonths, `Minimum age is ${minMonths} months`)
        .max(
          inquiryMaxMonths,
          `Maximum age is ${formatAgeMonths(inquiryMaxMonths)} (${inquiryMaxMonths} months)`
        )
    ),
    desiredStart: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .regex(ISO_DATE, 'Enter a valid start date')
        .refine(
          (date) => !Number.isNaN(new Date(`${date}T12:00:00`).getTime()),
          'Enter a valid start date'
        )
        .optional()
    ),
    intent: z.preprocess(
      emptyToUndefined,
      z.enum(['tour', 'waitlist'])
    ).catch('tour'),
    referredBy: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(200)
        .regex(/^[\p{L}\s'.-]+$/u, 'Use letters only')
        .optional()
    ),
    message: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(2000)
        .refine((message) => !message.includes('\0'), 'Invalid characters in text')
        .optional()
    ),
  });
}

export const inquiryInput = createInquiryInput(15, PUBLIC_INQUIRY_MAX_MONTHS);
export type InquiryInput = z.infer<typeof inquiryInput>;
