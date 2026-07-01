// Drizzle ORM schema for the admin panel (Cloudflare D1 / SQLite).
// Generate migrations with `npm run db:generate`, apply with `npm run db:migrate*`.

import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** Shared created/updated timestamp columns (stored as unix epoch seconds). */
const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
};

export const CHILD_STATUSES = [
  'inquiry',
  'waitlist',
  'enrolled',
  'withdrawn',
  'graduated',
] as const;

export const INQUIRY_STATUSES = [
  'new',
  'contacted',
  'toured',
  'offered',
  'enrolled',
  'declined',
] as const;

export const INQUIRY_INTENTS = ['tour', 'waitlist', 'referral'] as const;

export const INVOICE_STATUSES = [
  'draft',
  'sent',
  'paid',
  'overdue',
  'void',
] as const;

export const PAY_TYPES = ['hourly', 'salary'] as const;
export const EMPLOYEE_STATUSES = ['active', 'inactive'] as const;

export const RECURRING_FREQUENCIES = ['weekly', 'biweekly', 'monthly'] as const;

export const families = sqliteTable('families', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  primaryContactName: text('primary_contact_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  notes: text('notes'),
  ...timestamps,
});

export const classes = sqliteTable('classes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  ageMinMonths: integer('age_min_months'),
  ageMaxMonths: integer('age_max_months'),
  capacity: integer('capacity').notNull().default(0),
  color: text('color'),
  ...timestamps,
});

export const children = sqliteTable('children', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  familyId: integer('family_id').references(() => families.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  dob: text('dob'), // ISO date (YYYY-MM-DD)
  status: text('status', { enum: CHILD_STATUSES }).notNull().default('inquiry'),
  classId: integer('class_id').references(() => classes.id),
  startDate: text('start_date'),
  notes: text('notes'),
  ...timestamps,
});

export const inquiries = sqliteTable('inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  parentName: text('parent_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  childAge: text('child_age'),
  desiredStart: text('desired_start'),
  intent: text('intent', { enum: INQUIRY_INTENTS }).notNull().default('tour'),
  message: text('message'),
  referredBy: text('referred_by'),
  status: text('status', { enum: INQUIRY_STATUSES }).notNull().default('new'),
  source: text('source'),
  familyId: integer('family_id').references(() => families.id),
  // The existing family who referred this lead (set by staff in the admin).
  referredByFamilyId: integer('referred_by_family_id').references(
    () => families.id
  ),
  ...timestamps,
});

export const invoices = sqliteTable('invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  familyId: integer('family_id')
    .notNull()
    .references(() => families.id),
  childId: integer('child_id').references(() => children.id),
  amountCents: integer('amount_cents').notNull(),
  dueDate: text('due_date'), // ISO date
  status: text('status', { enum: INVOICE_STATUSES }).notNull().default('draft'),
  description: text('description'),
  period: text('period'), // e.g. "2026-09" or "Sep 2026"
  ...timestamps,
});

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  invoiceId: integer('invoice_id').references(() => invoices.id),
  familyId: integer('family_id')
    .notNull()
    .references(() => families.id),
  amountCents: integer('amount_cents').notNull(),
  method: text('method'), // cash, check, card, transfer, subsidy
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  note: text('note'),
  ...timestamps,
});

export const announcements = sqliteTable('announcements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  audience: text('audience', { enum: ['all', 'class'] })
    .notNull()
    .default('all'),
  classId: integer('class_id').references(() => classes.id),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  ...timestamps,
});

export const photos = sqliteTable('photos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  r2Key: text('r2_key').notNull(),
  caption: text('caption'),
  childId: integer('child_id').references(() => children.id),
  classId: integer('class_id').references(() => classes.id),
  takenAt: integer('taken_at', { mode: 'timestamp' }),
  ...timestamps,
});

// Recurring invoice schedules. A cron job (or the "run now" admin action)
// generates real invoices from these when next_run_date is reached.
export const recurringInvoices = sqliteTable('recurring_invoices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  familyId: integer('family_id')
    .notNull()
    .references(() => families.id),
  childId: integer('child_id').references(() => children.id),
  amountCents: integer('amount_cents').notNull(),
  description: text('description'),
  frequency: text('frequency', { enum: RECURRING_FREQUENCIES })
    .notNull()
    .default('monthly'),
  nextRunDate: text('next_run_date').notNull(), // ISO date (YYYY-MM-DD)
  lastRunDate: text('last_run_date'),
  autoSend: integer('auto_send', { mode: 'boolean' }).notNull().default(false),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  ...timestamps,
});

// Public-site settings the office can edit (single row, id = 1). Values shown
// on the tuition page; falls back to src/data/site.ts defaults when unset.
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  capacity: integer('capacity').notNull().default(12),
  weeklyFrom: integer('weekly_from').notNull().default(350),
  applicationFee: integer('application_fee').notNull().default(300),
  partTimeLabel: text('part_time_label').notNull().default('Part-time'),
  partTimePrice: text('part_time_price').notNull().default('Contact us'),
  partTimeNote: text('part_time_note').notNull().default('2 or 3 days / week'),
  fullTimeLabel: text('full_time_label').notNull().default('Full-time'),
  fullTimeNote: text('full_time_note')
    .notNull()
    .default('5 days / week, full day'),
  siblingDiscount: integer('sibling_discount', { mode: 'boolean' })
    .notNull()
    .default(true),
  subsidiesAccepted: integer('subsidies_accepted', { mode: 'boolean' })
    .notNull()
    .default(true),
  holidayScheduleTitle: text('holiday_schedule_title')
    .notNull()
    .default('Holiday schedule'),
  holidayScheduleIntro: text('holiday_schedule_intro')
    .notNull()
    .default(
      'The school will be closed on the following days for holidays and vacation. Tuition is required year-round.'
    ),
  ...timestamps,
});

// School closure dates shown on the tuition FAQ and in family notices.
export const holidays = sqliteTable('holidays', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  startDate: text('start_date').notNull(), // ISO date (YYYY-MM-DD)
  endDate: text('end_date'), // ISO date; null = single day
  ...timestamps,
});

// Staff / team members.
export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  role: text('role'),
  email: text('email'),
  phone: text('phone'),
  payType: text('pay_type', { enum: PAY_TYPES }).notNull().default('hourly'),
  // Hourly rate or annual salary, stored as integer cents.
  payRateCents: integer('pay_rate_cents').notNull().default(0),
  status: text('status', { enum: EMPLOYEE_STATUSES })
    .notNull()
    .default('active'),
  hireDate: text('hire_date'), // ISO date (YYYY-MM-DD)
  notes: text('notes'),
  ...timestamps,
});

// Payroll: a recorded payment to an employee for a pay period.
export const payrollEntries = sqliteTable('payroll_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employees.id),
  periodLabel: text('period_label'), // e.g. "Jun 1–15, 2026"
  hours: integer('hours'), // optional, for hourly staff
  grossCents: integer('gross_cents').notNull(),
  method: text('method'), // check, transfer, cash
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  notes: text('notes'),
  ...timestamps,
});

// Convenience row types.
export type Family = typeof families.$inferSelect;
export type NewFamily = typeof families.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type Child = typeof children.$inferSelect;
export type NewChild = typeof children.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;
export type Holiday = typeof holidays.$inferSelect;
export type NewHoliday = typeof holidays.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type PayrollEntry = typeof payrollEntries.$inferSelect;
export type NewPayrollEntry = typeof payrollEntries.$inferInsert;
export type RecurringInvoice = typeof recurringInvoices.$inferSelect;
export type NewRecurringInvoice = typeof recurringInvoices.$inferInsert;
