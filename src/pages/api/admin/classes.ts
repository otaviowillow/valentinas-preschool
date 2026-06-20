export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { classInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/classes/');

  if (action === 'create') {
    const parsed = classInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the class details.'), 303);
    }
    await db.insert(schema.classes).values(parsed.data);
    return redirect(addFlash(back, 'Class created.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'update') {
    const parsed = classInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the class details.'), 303);
    }
    await db
      .update(schema.classes)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(schema.classes.id, id));
    return redirect(addFlash(back, 'Class updated.'), 303);
  }

  if (action === 'delete') {
    // Unassign children/announcements/photos rather than orphaning rows.
    await db
      .update(schema.children)
      .set({ classId: null })
      .where(eq(schema.children.classId, id));
    await db
      .update(schema.announcements)
      .set({ classId: null })
      .where(eq(schema.announcements.classId, id));
    await db
      .update(schema.photos)
      .set({ classId: null })
      .where(eq(schema.photos.classId, id));
    await db.delete(schema.classes).where(eq(schema.classes.id, id));
    return redirect(addFlash('/admin/classes/', 'Class deleted.'), 303);
  }

  return badRequest('Unknown action');
};
