import { z } from 'zod';
import {
  CHILD_STATUSES,
  EMPLOYEE_STATUSES,
  INQUIRY_STATUSES,
  INVOICE_STATUSES,
  PAY_TYPES,
  RECURRING_FREQUENCIES,
} from '../db/schema';
import {
  CHILD_AGE_MAX_MONTHS,
  CHILD_AGE_MIN_MONTHS,
} from './inquiries';
import { formatAgeMonths } from './settings';
import { hasSuspiciousInjection } from './spam';

// HTML forms (and FormData.get) yield `null` for absent fields and `''` for
// empty ones. Normalize both so optional fields validate cleanly.
const trimOrEmpty = (v: unknown) =>
  typeof v === 'string' ? v.trim() : v == null ? '' : v;
const emptyToUndef = (v: unknown) => {
  const t = trimOrEmpty(v);
  return t === '' ? undefined : t;
};

const requiredStr = (max: number, msg: string) =>
  z.preprocess(trimOrEmpty, z.string().min(1, msg).max(max));
const optionalStr = (max = 500) =>
  z.preprocess(emptyToUndef, z.string().max(max).optional());
const optionalEmail = z.preprocess(
  emptyToUndef,
  z.string().email('Enter a valid email address').max(200).optional()
);
const requiredEmail = z.preprocess(
  trimOrEmpty,
  z.string().email('Enter a valid email address').max(200)
);

/** Letters, spaces, apostrophes, hyphens — no digits/URLs. */
const personName = (max: number, msg: string) =>
  z.preprocess(
    trimOrEmpty,
    z
      .string()
      .min(1, msg)
      .max(max)
      .regex(/^[\p{L}\s'.-]+$/u, 'Use letters only in names')
  );

const optionalPhone = z.preprocess(
  emptyToUndef,
  z
    .string()
    .regex(/^\d{10}$/, 'Enter a valid 10-digit phone number')
    .optional()
);

const safeOptionalText = (max: number) =>
  z.preprocess(
    emptyToUndef,
    z
      .string()
      .max(max)
      .refine((s) => !hasSuspiciousInjection(s), 'Invalid characters in text')
      .optional()
  );

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const optionalStartDate = z.preprocess(
  emptyToUndef,
  z
    .string()
    .regex(ISO_DATE, 'Enter a valid start date')
    .refine((s) => !Number.isNaN(new Date(`${s}T12:00:00`).getTime()), 'Enter a valid start date')
    .optional()
);

const optionalId = z.preprocess(
  emptyToUndef,
  z.coerce.number().int().positive().optional()
);
const requiredId = z.preprocess(emptyToUndef, z.coerce.number().int().positive());
const optionalMonths = z.preprocess(
  emptyToUndef,
  z.coerce.number().int().min(0).max(120).optional()
);
const requiredAmountCents = z.coerce.number().int().min(0);

// ---- Public enrollment inquiry (from the contact form) --------------------
export function createInquiryInput(minMonths: number, maxMonths: number) {
  return z.object({
    parentName: personName(100, 'Your name is required'),
    email: requiredEmail,
    phone: optionalPhone,
    childAge: z.preprocess(
      emptyToUndef,
      z.coerce
        .number({ error: 'Enter your child’s age in months' })
        .int()
        .min(minMonths, `Minimum age is ${minMonths} months`)
        .max(
          maxMonths,
          `Maximum age is ${formatAgeMonths(maxMonths)} (${maxMonths} months)`
        )
    ),
    desiredStart: optionalStartDate,
    intent: z.preprocess(emptyToUndef, z.enum(['tour', 'waitlist'])).catch('tour'),
    referredBy: z.preprocess(
      emptyToUndef,
      z
        .string()
        .max(200)
        .regex(/^[\p{L}\s'.-]+$/u, 'Use letters only')
        .optional()
    ),
    message: safeOptionalText(2000),
  });
}

export const inquiryInput = createInquiryInput(
  CHILD_AGE_MIN_MONTHS,
  CHILD_AGE_MAX_MONTHS
);
export type InquiryInput = z.infer<typeof inquiryInput>;

// ---- Admin forms ----------------------------------------------------------
export const familyInput = z.object({
  primaryContactName: requiredStr(200, 'Contact name is required'),
  email: optionalEmail,
  phone: optionalStr(50),
  address: optionalStr(300),
  notes: optionalStr(2000),
});

export const childInput = z.object({
  firstName: requiredStr(120, 'First name is required'),
  lastName: optionalStr(120),
  dob: optionalStr(20),
  status: z.preprocess(emptyToUndef, z.enum(CHILD_STATUSES)).catch('inquiry'),
  familyId: optionalId,
  classId: optionalId,
  startDate: optionalStr(40),
  notes: optionalStr(2000),
});

export const classInput = z.object({
  name: requiredStr(120, 'Class name is required'),
  description: optionalStr(500),
  ageMinMonths: optionalMonths,
  ageMaxMonths: optionalMonths,
  capacity: z.preprocess(emptyToUndef, z.coerce.number().int().min(0).max(100)).catch(0),
  color: optionalStr(20),
});

export const invoiceInput = z.object({
  familyId: requiredId,
  childId: optionalId,
  amountCents: requiredAmountCents,
  dueDate: optionalStr(20),
  status: z.preprocess(emptyToUndef, z.enum(INVOICE_STATUSES)).catch('draft'),
  description: optionalStr(300),
  period: optionalStr(40),
});

export const paymentInput = z.object({
  invoiceId: optionalId,
  familyId: requiredId,
  amountCents: requiredAmountCents,
  method: optionalStr(40),
  note: optionalStr(300),
});

export const announcementInput = z.object({
  title: requiredStr(200, 'Title is required'),
  body: requiredStr(5000, 'Message is required'),
  audience: z.preprocess(emptyToUndef, z.enum(['all', 'class'])).catch('all'),
  classId: optionalId,
});

export const inquiryStatusInput = z.object({
  status: z.enum(INQUIRY_STATUSES),
});

// ---- Public-site settings -------------------------------------------------
const boolFromForm = z.preprocess(
  (v) => v === 'on' || v === 'true' || v === '1' || v === true,
  z.boolean()
);
const nonNegInt = z.preprocess(emptyToUndef, z.coerce.number().int().min(0));

const ageMonths = z.preprocess(
  emptyToUndef,
  z.coerce.number().int().min(1).max(84)
);

export const settingsInput = z
  .object({
    capacity: nonNegInt.catch(0),
    weeklyFrom: nonNegInt.catch(0),
    applicationFee: nonNegInt.catch(0),
    partTimeLabel: requiredStr(60, 'Part-time label is required'),
    partTimePrice: requiredStr(60, 'Part-time price is required'),
    partTimeNote: optionalStr(120),
    fullTimeLabel: requiredStr(60, 'Full-time label is required'),
    fullTimeNote: optionalStr(120),
    siblingDiscount: boolFromForm,
    subsidiesAccepted: boolFromForm,
    ageMinMonths: ageMonths.catch(15),
    ageMaxMonths: ageMonths.catch(60),
    tuitionNote: z
      .preprocess(trimOrEmpty, z.string().max(500))
      .catch('Pricing varies by schedule (2, 3, or 5 days). Contact us for current rates.'),
    siblingDiscountNote: z
      .preprocess(trimOrEmpty, z.string().max(500))
      .catch('Please contact us for sibling discount details.'),
    referralEnabled: boolFromForm,
    referralTitle: requiredStr(120, 'Referral title is required'),
    referralBody: requiredStr(2000, 'Referral description is required'),
  })
  .refine((d) => d.ageMaxMonths >= d.ageMinMonths, {
    message: 'Maximum age must be at least the minimum age',
    path: ['ageMaxMonths'],
  });

export const holidayScheduleInput = z.object({
  holidayScheduleTitle: requiredStr(200, 'Holiday schedule title is required'),
  holidayScheduleIntro: requiredStr(2000, 'Holiday schedule intro is required'),
});

export const holidayInput = z
  .object({
    name: requiredStr(120, 'Holiday name is required'),
    startDate: requiredStr(10, 'Start date is required').refine(
      (s) => ISO_DATE.test(s),
      'Enter a valid start date'
    ),
    endDate: z.preprocess(
      emptyToUndef,
      z
        .string()
        .regex(ISO_DATE, 'Enter a valid end date')
        .optional()
    ),
  })
  .refine(
    (d) => !d.endDate || d.endDate >= d.startDate,
    { message: 'End date must be on or after start date', path: ['endDate'] }
  );

// ---- Team / payroll -------------------------------------------------------
export const employeeInput = z.object({
  name: requiredStr(160, 'Name is required'),
  role: optionalStr(120),
  email: optionalEmail,
  phone: optionalStr(50),
  payType: z.preprocess(emptyToUndef, z.enum(PAY_TYPES)).catch('hourly'),
  payRateCents: requiredAmountCents,
  status: z.preprocess(emptyToUndef, z.enum(EMPLOYEE_STATUSES)).catch('active'),
  hireDate: optionalStr(20),
  notes: optionalStr(2000),
});

export const payrollInput = z.object({
  employeeId: requiredId,
  periodLabel: optionalStr(80),
  hours: z.preprocess(emptyToUndef, z.coerce.number().int().min(0).max(2000).optional()),
  grossCents: requiredAmountCents,
  method: optionalStr(40),
  notes: optionalStr(500),
});

export const recurringInput = z.object({
  familyId: requiredId,
  childId: optionalId,
  amountCents: requiredAmountCents,
  description: optionalStr(300),
  frequency: z
    .preprocess(emptyToUndef, z.enum(RECURRING_FREQUENCIES))
    .catch('monthly'),
  nextRunDate: requiredStr(20, 'A start date is required'),
  autoSend: boolFromForm,
});
