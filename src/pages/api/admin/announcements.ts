export const prerender = false;

import type { APIRoute } from 'astro';
import { eq, isNotNull } from 'drizzle-orm';
import { dbFrom, getEnv, schema } from '../../../db';
import { announcementInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { escapeHtml, sendEmail } from '../../../lib/email';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/comms/');

  if (action === 'create') {
    const parsed = announcementInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the announcement.'), 303);
    }
    const data = parsed.data;
    await db.insert(schema.announcements).values({
      title: data.title,
      body: data.body,
      audience: data.audience,
      classId: data.audience === 'class' ? (data.classId ?? null) : null,
      publishedAt: new Date(),
    });

    // Optional: email families. No-op unless RESEND_API_KEY is set.
    if (form.get('email') === 'on') {
      const env = getEnv();
      if (env.RESEND_API_KEY) {
        const recipients = await recipientEmails(
          db,
          data.audience === 'class' ? (data.classId ?? null) : null
        );
        for (const to of recipients) {
          await sendEmail(env, {
            to,
            subject: data.title,
            html: `<h2>${escapeHtml(data.title)}</h2><p>${escapeHtml(
              data.body
            ).replace(/\n/g, '<br>')}</p>`,
          });
        }
      }
    }
    return redirect(addFlash(back, 'Announcement posted.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'delete') {
    await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
    return redirect(addFlash(back, 'Announcement deleted.'), 303);
  }

  return badRequest('Unknown action');
};

async function recipientEmails(
  db: ReturnType<typeof dbFrom>,
  classId: number | null
): Promise<string[]> {
  if (classId) {
    const rows = await db
      .select({ email: schema.families.email })
      .from(schema.children)
      .innerJoin(
        schema.families,
        eq(schema.children.familyId, schema.families.id)
      )
      .where(eq(schema.children.classId, classId));
    return unique(rows.map((r) => r.email));
  }
  const rows = await db
    .select({ email: schema.families.email })
    .from(schema.families)
    .where(isNotNull(schema.families.email));
  return unique(rows.map((r) => r.email));
}

function unique(values: (string | null)[]): string[] {
  return [...new Set(values.filter((v): v is string => !!v))];
}
