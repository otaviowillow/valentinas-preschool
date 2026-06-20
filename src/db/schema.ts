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
