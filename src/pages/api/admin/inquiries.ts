export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, schema } from '../../../db';
import { ensureFamilyFromInquiry, upsertFamilyForEnroll } from '../../../lib/inquiries';
import { addError, addFlash, badRequest, notFound, redirectTarget } from '../../../lib/admin';
import { childInput, familyInput, inquiryStatusInput } from '../../../lib/validation';

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

  const self = `/admin/inquiries/${id}/`;

  if (action === 'status') {
    const parsed = inquiryStatusInput.safeParse({ status: form.get('status') });
    if (!parsed.success) return badRequest('Invalid status');
    if (parsed.data.status === 'enrolled') {
      return redirect(`${self}#enroll`, 303);
    }
    await db
      .update(schema.inquiries)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(schema.inquiries.id, id));
    return redirect(redirectTarget(form, self), 303);
  }

  if (action === 'enroll') {
    if (inquiry.status === 'enrolled') {
      return redirect(addError(self, 'This inquiry is already enrolled.'), 303);
    }
    const familyParsed = familyInput.safeParse({
      primaryContactName: form.get('primaryContactName'),
      email: form.get('email'),
      phone: form.get('phone'),
      address: form.get('address'),
      notes: form.get('familyNotes'),
    });
    if (!familyParsed.success) {
      return redirect(addError(`${self}#enroll`, 'Check the family details.'), 303);
    }
    const childParsed = childInput.safeParse({
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      dob: form.get('dob'),
      classId: form.get('classId'),
      startDate: form.get('startDate'),
      notes: form.get('childNotes'),
    });
    if (!childParsed.success) {
      return redirect(addError(`${self}#enroll`, 'Check the child details.'), 303);
    }
    const familyId = await upsertFamilyForEnroll(db, inquiry, id, familyParsed.data);
    await db.insert(schema.children).values({
      ...childParsed.data,
      familyId,
      status: 'enrolled',
    });
    await db
      .update(schema.inquiries)
      .set({ status: 'enrolled', familyId, updatedAt: new Date() })
      .where(eq(schema.inquiries.id, id));
    return redirect(
      addFlash(`/admin/families/${familyId}/`, `${childParsed.data.firstName} enrolled.`),
      303
    );
  }

  if (action === 'convert') {
    const familyId = await ensureFamilyFromInquiry(db, inquiry, id);
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
    return redirect(redirectTarget(form, self), 303);
  }

  if (action === 'delete') {
    await db.delete(schema.inquiries).where(eq(schema.inquiries.id, id));
    return redirect(redirectTarget(form, '/admin/inquiries/'), 303);
  }

  return badRequest('Unknown action');
};
