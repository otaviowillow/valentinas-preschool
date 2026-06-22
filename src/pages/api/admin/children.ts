export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { childInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/children/');

  if (action === 'create') {
    const parsed = childInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the child details.'), 303);
    }
    if (!parsed.data.familyId) {
      return redirect(addError(back, 'Choose a family.'), 303);
    }
    await db.insert(schema.children).values(parsed.data);
    return redirect(addFlash(back, 'Child added.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'update') {
    const parsed = childInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the child details.'), 303);
    }
    await db
      .update(schema.children)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(schema.children.id, id));
    return redirect(addFlash(back, 'Child updated.'), 303);
  }

  if (action === 'delete') {
    // Detach references first (FKs aren't enforced by default on D1).
    await db
      .update(schema.invoices)
      .set({ childId: null })
      .where(eq(schema.invoices.childId, id));
    await db
      .update(schema.photos)
      .set({ childId: null })
      .where(eq(schema.photos.childId, id));
    await db.delete(schema.children).where(eq(schema.children.id, id));
    return redirect(addFlash('/admin/children/', 'Child deleted.'), 303);
  }

  return badRequest('Unknown action');
};
