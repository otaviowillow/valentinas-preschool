export const prerender = false;

import type { APIRoute } from 'astro';
import { eq, not } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { recurringInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { toCents } from '../../../lib/format';
import { runRecurringBilling } from '../../../lib/recurring';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/billing/');

  // Generate any due invoices across all schedules.
  if (action === 'run') {
    const { created, emailed } = await runRecurringBilling();
    const msg =
      created === 0
        ? 'No invoices were due.'
        : `Generated ${created} invoice${created === 1 ? '' : 's'}` +
          (emailed ? `, emailed ${emailed}.` : '.');
    return redirect(addFlash(back, msg), 303);
  }

  if (action === 'create') {
    const parsed = recurringInput.safeParse({
      ...Object.fromEntries(form),
      amountCents: toCents(form.get('amount')),
    });
    if (!parsed.success) {
      return redirect(addError(back, 'Check the recurring plan details.'), 303);
    }
    await db.insert(schema.recurringInvoices).values(parsed.data);
    return redirect(addFlash(back, 'Recurring plan created.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'toggle') {
    await db
      .update(schema.recurringInvoices)
      .set({ active: not(schema.recurringInvoices.active), updatedAt: new Date() })
      .where(eq(schema.recurringInvoices.id, id));
    return redirect(addFlash(back, 'Recurring plan updated.'), 303);
  }

  if (action === 'delete') {
    await db
      .delete(schema.recurringInvoices)
      .where(eq(schema.recurringInvoices.id, id));
    return redirect(addFlash(back, 'Recurring plan removed.'), 303);
  }

  return badRequest('Unknown action');
};
