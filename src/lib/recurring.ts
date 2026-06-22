// Generates real invoices from active recurring schedules whose next_run_date
// has arrived. Called by the admin "Run due billing now" action and (optionally)
// a Cloudflare Cron Trigger. Idempotent-ish: it advances next_run_date and will
// catch up multiple missed cycles (capped) so a missed run doesn't skip a month.

import { and, eq, lte } from 'drizzle-orm';
import { dbFrom, getEnv, schema } from '../db';
import { escapeHtml, sendEmail } from './email';
import { money } from './format';

function advance(dateStr: string, freq: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  if (freq === 'weekly') d.setUTCDate(d.getUTCDate() + 7);
  else if (freq === 'biweekly') d.setUTCDate(d.getUTCDate() + 14);
  else d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString().slice(0, 10);
}

export async function runRecurringBilling(): Promise<{
  created: number;
  emailed: number;
}> {
  const db = dbFrom();
  const env = getEnv();
  const today = new Date().toISOString().slice(0, 10);

  const due = await db
    .select()
    .from(schema.recurringInvoices)
    .where(
      and(
        eq(schema.recurringInvoices.active, true),
        lte(schema.recurringInvoices.nextRunDate, today)
      )
    );

  let created = 0;
  let emailed = 0;

  for (const r of due) {
    // Look up the family email once, only if we may need to send.
    let familyEmail: string | null = null;
    if (r.autoSend && env.RESEND_API_KEY) {
      const [fam] = await db
        .select({ email: schema.families.email })
        .from(schema.families)
        .where(eq(schema.families.id, r.familyId));
      familyEmail = fam?.email ?? null;
    }

    let next = r.nextRunDate;
    let guard = 0;
    while (next <= today && guard < 60) {
      await db.insert(schema.invoices).values({
        familyId: r.familyId,
        childId: r.childId ?? null,
        amountCents: r.amountCents,
        status: 'sent',
        description: r.description ?? 'Recurring tuition',
        period: next,
        dueDate: next,
      });
      created++;

      if (familyEmail) {
        await sendEmail(env, {
          to: familyEmail,
          subject: `Invoice from Valentina's Preschool`,
          html: `<p>A new invoice for <strong>${money(
            r.amountCents
          )}</strong> is due ${escapeHtml(next)}.</p><p>${escapeHtml(
            r.description ?? 'Recurring tuition'
          )}</p>`,
        });
        emailed++;
      }

      next = advance(next, r.frequency);
      guard++;
    }

    await db
      .update(schema.recurringInvoices)
      .set({ nextRunDate: next, lastRunDate: today, updatedAt: new Date() })
      .where(eq(schema.recurringInvoices.id, r.id));
  }

  return { created, emailed };
}
