// Optional transactional email via Resend (https://resend.com), called from the
// Worker. It's a no-op unless RESEND_API_KEY is set as a Worker secret, so the
// app works fine without it. The `from` domain must be verified in Resend.

const FROM = "Valentina's Preschool <hello@valentinaspreschool.com>";

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(
  env: Env,
  { to, subject, html, replyTo }: SendArgs
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (!env.RESEND_API_KEY) return { ok: false, skipped: true };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
