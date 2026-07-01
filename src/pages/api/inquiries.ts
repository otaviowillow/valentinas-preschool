export const prerender = false;

import type { APIRoute } from 'astro';
import { dbFrom, getEnv, schema } from '../../db';
import { createInquiryInput } from '../../lib/validation';
import { formatChildAgeMonths } from '../../lib/inquiries';
import { getSettings } from '../../lib/settings';
import {
  detectIntakeSpam,
  intakeRateLimitAllowed,
  scoreFormTiming,
} from '../../lib/spam';
import { sendEmail, escapeHtml } from '../../lib/email';

const thankYou = (redirect: (url: string, status: number) => Response) =>
  redirect('/thank-you/', 303);

function formatDesiredStart(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Public enrollment intake. The contact form posts here (no JS required); we
// validate, store the inquiry in D1, optionally notify the school by email, then
// redirect to a thank-you page.
export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (
    !contentType.includes('multipart/form-data') &&
    !contentType.includes('application/x-www-form-urlencoded')
  ) {
    return new Response('Unsupported Media Type', { status: 415 });
  }

  const env = getEnv();
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  if (!(await intakeRateLimitAllowed(env.SESSION, ip))) {
    return thankYou(redirect);
  }

  const form = await request.formData();

  // Honeypots: bots fill hidden fields. Pretend success without storing.
  if (
    String(form.get('website') ?? '').trim() !== '' ||
    String(form.get('company') ?? '').trim() !== ''
  ) {
    return thankYou(redirect);
  }

  const timing = scoreFormTiming(form.get('form_ts'));
  if (timing.reason === 'too_fast') {
    return thankYou(redirect);
  }

  const settings = await getSettings();
  const parsed = createInquiryInput(
    settings.ageMinMonths,
    settings.ageMaxMonths
  ).safeParse({
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

  const spam = detectIntakeSpam(data);
  const timingSpam = timing.score >= 3;
  if (spam.spam || timingSpam) {
    return thankYou(redirect);
  }

  const db = dbFrom();

  await db.insert(schema.inquiries).values({
    parentName: data.parentName,
    email: data.email,
    phone: data.phone ?? null,
    childAge: formatChildAgeMonths(data.childAge),
    desiredStart: data.desiredStart ?? null,
    intent: data.intent,
    referredBy: data.referredBy ?? null,
    message: data.message ?? null,
    source: 'website',
    status: 'new',
  });

  if (env.NOTIFY_EMAIL) {
    const lines = [
      `Parent: ${data.parentName}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone ?? '—'}`,
      `Child age: ${formatChildAgeMonths(data.childAge)}`,
      `Desired start: ${formatDesiredStart(data.desiredStart)}`,
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
        data.referredBy ? 'referrals' : 'inquiries'
      }/">Open in admin</a></p>`,
    });
  }

  return thankYou(redirect);
};

// Visiting the endpoint directly: bounce to the contact form.
export const GET: APIRoute = ({ redirect }) => redirect('/contact/', 302);
