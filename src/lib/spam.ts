import type { InquiryInput } from './validation';

/** Marketing / SEO spam phrases seen in preschool intake abuse. */
const SPAM_PHRASES = [
  'search engine optimization',
  'local seo',
  'google ranking',
  'optimize your online presence',
  'digital marketing',
  'backlink',
  'link building',
  'website design service',
  'web design service',
  'increase your traffic',
  'click here to visit',
  'web development company',
  'marketing agency',
  'social media marketing',
  'rank higher on google',
  'business listing',
  'reputation management',
  'grow your business online',
];

const URL_RE = /https?:\/\/|www\.\w|\b[a-z0-9-]+\.(com|net|org|io|co|biz|info|xyz)\b/i;

/** Reject obvious injection payloads in plain-text form fields (D1 uses bound params). */
export function hasSuspiciousInjection(value: string): boolean {
  if (/\x00/.test(value)) return true;
  if (URL_RE.test(value) && value.length < 120) {
    // Short fields like names should not contain domains/URLs.
    if (!/\s/.test(value) || /https?:\/\//i.test(value)) return true;
  }
  return /(\b(select|insert|update|delete|drop|union|alter|create)\b[\s\S]{0,40}\b(from|into|table|set|where)\b)/i.test(
    value
  );
}

export function containsUrl(value: string): boolean {
  return URL_RE.test(value);
}

/** e.g. p.r.a.n.a.b.ses.1@gmail.com — common SEO spam pattern. */
export function isDotStuffedEmail(email: string): boolean {
  const local = email.split('@')[0] ?? '';
  const dots = (local.match(/\./g) ?? []).length;
  return dots >= 4 || (dots >= 2 && local.replace(/\./g, '').length <= 8);
}

function countUrls(...parts: Array<string | undefined>): number {
  const text = parts.filter(Boolean).join(' ');
  return (text.match(/https?:\/\/\S+|www\.\S+/gi) ?? []).length;
}

export type SpamVerdict = { spam: boolean; score: number; reasons: string[] };

/** Score intake submissions; spam at >= 3 or any high-confidence hit. */
export function detectIntakeSpam(data: InquiryInput): SpamVerdict {
  const reasons: string[] = [];
  let score = 0;

  const blob = [
    data.parentName,
    data.email,
    data.phone,
    data.desiredStart,
    data.referredBy,
    data.message,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const phrase of SPAM_PHRASES) {
    if (blob.includes(phrase)) {
      reasons.push(`phrase:${phrase}`);
      score += 3;
      break;
    }
  }

  const urls = countUrls(data.message, data.parentName, data.desiredStart);
  if (urls >= 2) {
    reasons.push('multiple_urls');
    score += 3;
  } else if (urls === 1 && (data.message?.length ?? 0) > 80) {
    reasons.push('url_in_message');
    score += 2;
  }

  if (data.email && isDotStuffedEmail(data.email)) {
    reasons.push('dot_stuffed_email');
    score += 2;
  }

  if ((data.message?.length ?? 0) > 400 && urls >= 1) {
    reasons.push('long_pitch');
    score += 1;
  }

  // Name repeated in unrelated fields (classic bot form fill).
  const name = data.parentName.trim().toLowerCase();
  if (
    name.length >= 3 &&
    data.intent !== 'referral' &&
    (data.desiredStart?.trim().toLowerCase() === name ||
      data.referredBy?.trim().toLowerCase() === name)
  ) {
    reasons.push('duplicate_name_fields');
    score += 2;
  }

  const highConfidence = reasons.some((r) =>
    r.startsWith('phrase:') || r === 'multiple_urls'
  );

  return { spam: highConfidence || score >= 3, score, reasons };
}

/** Minimum ms between page load (form_ts) and submit. */
export const FORM_MIN_ELAPSED_MS = 2500;
/** Ignore stale tabs older than this. */
export const FORM_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function scoreFormTiming(formTsRaw: unknown): { score: number; reason?: string } {
  const ts = Number(formTsRaw);
  if (!Number.isFinite(ts) || ts <= 0) {
    return { score: 1, reason: 'missing_form_ts' };
  }
  const elapsed = Date.now() - ts;
  if (elapsed < FORM_MIN_ELAPSED_MS) {
    return { score: 5, reason: 'too_fast' };
  }
  if (elapsed > FORM_MAX_AGE_MS) {
    return { score: 1, reason: 'stale_form' };
  }
  return { score: 0 };
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SEC = 60 * 60;

/** Returns false when the client should be throttled (silent reject). */
export async function intakeRateLimitAllowed(
  kv: KVNamespace | undefined,
  ip: string
): Promise<boolean> {
  if (!kv || ip === 'unknown') return true;
  const key = `intake:${ip}`;
  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= RATE_LIMIT_MAX) return false;
  await kv.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SEC });
  return true;
}
