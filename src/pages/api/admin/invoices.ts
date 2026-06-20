export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { invoiceInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { toCents } from '../../../lib/format';
import { INVOICE_STATUSES } from '../../../db/schema';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/billing/');

  if (action === 'create') {
    const parsed = invoiceInput.safeParse({
      ...Object.fromEntries(form),
      amountCents: toCents(form.get('amount')),
    });
    if (!parsed.success) {
      return redirect(addError(back, 'Check the invoice details.'), 303);
    }
    await db.insert(schema.invoices).values(parsed.data);
    return redirect(addFlash(back, 'Invoice created.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'status') {
    const status = String(form.get('status') ?? '');
    if (!INVOICE_STATUSES.includes(status as (typeof INVOICE_STATUSES)[number])) {
      return badRequest('Invalid status');
    }
    await db
      .update(schema.invoices)
      .set({ status: status as (typeof INVOICE_STATUSES)[number], updatedAt: new Date() })
      .where(eq(schema.invoices.id, id));
    return redirect(addFlash(back, 'Invoice updated.'), 303);
  }

  if (action === 'delete') {
    await db
      .update(schema.payments)
      .set({ invoiceId: null })
      .where(eq(schema.payments.invoiceId, id));
    await db.delete(schema.invoices).where(eq(schema.invoices.id, id));
    return redirect(addFlash(back, 'Invoice deleted.'), 303);
  }

  return badRequest('Unknown action');
};
