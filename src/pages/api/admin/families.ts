export const prerender = false;

import type { APIRoute } from 'astro';
import { count, eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { familyInput } from '../../../lib/validation';
import { badRequest } from '../../../lib/admin';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();

  if (action === 'create') {
    const parsed = familyInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect('/admin/families/?error=Check the family details.', 303);
    }
    const [row] = await db
      .insert(schema.families)
      .values(parsed.data)
      .returning({ id: schema.families.id });
    return redirect(`/admin/families/${row.id}/?flash=Family created.`, 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'update') {
    const parsed = familyInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(
        `/admin/families/${id}/?error=Check the family details.`,
        303
      );
    }
    await db
      .update(schema.families)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(schema.families.id, id));
    return redirect(`/admin/families/${id}/?flash=Family updated.`, 303);
  }

  if (action === 'delete') {
    const [kids] = await db
      .select({ c: count() })
      .from(schema.children)
      .where(eq(schema.children.familyId, id));
    const [inv] = await db
      .select({ c: count() })
      .from(schema.invoices)
      .where(eq(schema.invoices.familyId, id));
    if ((kids?.c ?? 0) > 0 || (inv?.c ?? 0) > 0) {
      return redirect(
        `/admin/families/${id}/?error=Remove this family's children and invoices first.`,
        303
      );
    }
    await db.delete(schema.families).where(eq(schema.families.id, id));
    return redirect('/admin/families/?flash=Family deleted.', 303);
  }

  return badRequest('Unknown action');
};
