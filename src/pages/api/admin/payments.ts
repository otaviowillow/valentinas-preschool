export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { paymentInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { toCents } from '../../../lib/format';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/billing/');

  if (action === 'create') {
    const parsed = paymentInput.safeParse({
      ...Object.fromEntries(form),
      amountCents: toCents(form.get('amount')),
    });
    if (!parsed.success) {
      return redirect(addError(back, 'Check the payment details.'), 303);
    }
    await db
      .insert(schema.payments)
      .values({ ...parsed.data, paidAt: new Date() });

    // Recording a payment against a specific invoice marks it paid.
    if (parsed.data.invoiceId) {
      await db
        .update(schema.invoices)
        .set({ status: 'paid', updatedAt: new Date() })
        .where(eq(schema.invoices.id, parsed.data.invoiceId));
    }
    return redirect(addFlash(back, 'Payment recorded.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'delete') {
    await db.delete(schema.payments).where(eq(schema.payments.id, id));
    return redirect(addFlash(back, 'Payment deleted.'), 303);
  }

  return badRequest('Unknown action');
};
