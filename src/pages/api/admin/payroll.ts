export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { payrollInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { toCents } from '../../../lib/format';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/payroll/');

  if (action === 'create') {
    const normalized = {
      ...Object.fromEntries(form),
      grossCents: toCents(form.get('gross')),
    };
    const parsed = payrollInput.safeParse(normalized);
    if (!parsed.success) {
      return redirect(addError(back, 'Check the payroll entry.'), 303);
    }
    await db
      .insert(schema.payrollEntries)
      .values({ ...parsed.data, paidAt: new Date() });
    return redirect(addFlash(back, 'Payment recorded.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'delete') {
    await db.delete(schema.payrollEntries).where(eq(schema.payrollEntries.id, id));
    return redirect(addFlash(back, 'Payroll entry deleted.'), 303);
  }

  return badRequest('Unknown action');
};
