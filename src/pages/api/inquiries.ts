export const prerender = false;

import type { APIRoute } from 'astro';
import { dbFrom, getEnv, schema } from '../../db';
import { inquiryInput } from '../../lib/validation';
import { sendEmail, escapeHtml } from '../../lib/email';

// Public enrollment intake. The contact form posts here (no JS required); we
// validate, store the inquiry in D1, optionally notify the school by email, then
// redirect to a thank-you page.
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  // Honeypot: bots fill hidden fields. Pretend success without storing.
  if (String(form.get('website') ?? '').trim() !== '') {
    return redirect('/thank-you/', 303);
  }

  const parsed = inquiryInput.safeParse({
    parentName: form.get('parent_name'),
    email: form.get('email'),
    phone: form.get('phone'),
    childAge: form.get('child_age'),
    desiredStart: form.get('start_date'),
    intent: form.get('intent'),
    referredBy: form.get('referred_by'),
    message: form.get('message'),
  });

  if (!parsed.success) {
    return redirect('/contact/?error=1', 303);
  }

  const data = parsed.data;
  const db = dbFrom();

  await db.insert(schema.inquiries).values({
    parentName: data.parentName,
    email: data.email ?? null,
    phone: data.phone ?? null,
    childAge: data.childAge ?? null,
    desiredStart: data.desiredStart ?? null,
    intent: data.intent,
    referredBy: data.referredBy ?? null,
    message: data.message ?? null,
    source: 'website',
    status: 'new',
  });

  // Fire-and-forget notification (no-op if RESEND_API_KEY/NOTIFY_EMAIL unset).
  const env = getEnv();
  if (env.NOTIFY_EMAIL) {
    const lines = [
      `Parent: ${data.parentName}`,
      `Email: ${data.email ?? '—'}`,
      `Phone: ${data.phone ?? '—'}`,
      `Child age: ${data.childAge ?? '—'}`,
      `Desired start: ${data.desiredStart ?? '—'}`,
      `Intent: ${data.intent}`,
      `Referred by: ${data.referredBy ?? '—'}`,
      `Message: ${data.message ?? '—'}`,
    ];
    await sendEmail(env, {
      to: env.NOTIFY_EMAIL,
      subject: `New inquiry: ${data.parentName}`,
      replyTo: data.email,
      html: `<h2>New website inquiry</h2><p>${lines
        .map((l) => escapeHtml(l))
        .join('<br>')}</p><p><a href="https://www.valentinaspreschool.com/admin/${
        data.intent === 'referral' ? 'referrals' : 'inquiries'
      }/">Open in admin</a></p>`,
    });
  }

  return redirect('/thank-you/', 303);
};

// Visiting the endpoint directly: bounce to the contact form.
export const GET: APIRoute = ({ redirect }) => redirect('/contact/', 302);
