export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { employeeInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { toCents } from '../../../lib/format';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/team/');

  // Pay rate is entered in dollars; store as integer cents.
  const normalized = {
    ...Object.fromEntries(form),
    payRateCents: toCents(form.get('payRate')),
  };

  if (action === 'create') {
    const parsed = employeeInput.safeParse(normalized);
    if (!parsed.success) {
      return redirect(addError(back, 'Check the team member details.'), 303);
    }
    await db.insert(schema.employees).values(parsed.data);
    return redirect(addFlash(back, 'Team member added.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'update') {
    const parsed = employeeInput.safeParse(normalized);
    if (!parsed.success) {
      return redirect(addError(back, 'Check the team member details.'), 303);
    }
    await db
      .update(schema.employees)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(schema.employees.id, id));
    return redirect(addFlash(back, 'Team member updated.'), 303);
  }

  if (action === 'delete') {
    await db
      .delete(schema.payrollEntries)
      .where(eq(schema.payrollEntries.employeeId, id));
    await db.delete(schema.employees).where(eq(schema.employees.id, id));
    return redirect(addFlash('/admin/team/', 'Team member removed.'), 303);
  }

  return badRequest('Unknown action');
};
