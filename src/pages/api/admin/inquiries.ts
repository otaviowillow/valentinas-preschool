export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { inquiryStatusInput } from '../../../lib/validation';
import { badRequest, notFound, redirectTarget } from '../../../lib/admin';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  const db = dbFrom();
  const [inquiry] = await db
    .select()
    .from(schema.inquiries)
    .where(eq(schema.inquiries.id, id));
  if (!inquiry) return notFound();

  if (action === 'status') {
    const parsed = inquiryStatusInput.safeParse({ status: form.get('status') });
    if (!parsed.success) return badRequest('Invalid status');
    await db
      .update(schema.inquiries)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(schema.inquiries.id, id));
    return redirect(redirectTarget(form, `/admin/inquiries/${id}/`), 303);
  }

  if (action === 'convert') {
    let familyId = inquiry.familyId;
    if (!familyId) {
      const [family] = await db
        .insert(schema.families)
        .values({
          primaryContactName: inquiry.parentName,
          email: inquiry.email,
          phone: inquiry.phone,
          notes: inquiry.message
            ? `From inquiry #${id}: ${inquiry.message}`
            : `Created from inquiry #${id}.`,
        })
        .returning({ id: schema.families.id });
      familyId = family.id;
      await db
        .update(schema.inquiries)
        .set({
          familyId,
          status: inquiry.status === 'new' ? 'contacted' : inquiry.status,
          updatedAt: new Date(),
        })
        .where(eq(schema.inquiries.id, id));
    }
    return redirect(`/admin/families/${familyId}/`, 303);
  }

  if (action === 'link_referrer') {
    const raw = String(form.get('referredByFamilyId') ?? '').trim();
    const referrerId = raw ? Number(raw) : null;
    if (raw && (!Number.isInteger(referrerId) || referrerId! <= 0)) {
      return badRequest('Invalid family');
    }
    await db
      .update(schema.inquiries)
      .set({ referredByFamilyId: referrerId, updatedAt: new Date() })
      .where(eq(schema.inquiries.id, id));
    return redirect(redirectTarget(form, `/admin/inquiries/${id}/`), 303);
  }

  if (action === 'delete') {
    await db.delete(schema.inquiries).where(eq(schema.inquiries.id, id));
    return redirect(redirectTarget(form, '/admin/inquiries/'), 303);
  }

  return badRequest('Unknown action');
};
