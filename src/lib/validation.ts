import { z } from 'zod';
import {
  CHILD_STATUSES,
  EMPLOYEE_STATUSES,
  INQUIRY_INTENTS,
  INQUIRY_STATUSES,
  INVOICE_STATUSES,
  PAY_TYPES,
  RECURRING_FREQUENCIES,
} from '../db/schema';

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
export const inquiryInput = z.object({
  parentName: requiredStr(200, 'Your name is required'),
  email: optionalEmail,
  phone: optionalStr(50),
  childAge: optionalStr(100),
  desiredStart: optionalStr(100),
  intent: z.preprocess(emptyToUndef, z.enum(INQUIRY_INTENTS)).catch('tour'),
  referredBy: optionalStr(200),
  message: optionalStr(2000),
});
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

export const settingsInput = z.object({
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
});

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
