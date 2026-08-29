export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, getEnv, schema } from '../../../db';
import { announcementInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { escapeHtml, sendEmail } from '../../../lib/email';
import {
  sendAnnouncementEmails,
  type AnnouncementEmailSummary,
} from '../../../lib/announcements';
import { getAnnouncementRecipientEmails } from '../../../lib/announcement-recipients';
import {
  familyEmailResultMessage,
  isFamilyEmailReady,
} from '../../../lib/email-setup';

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

    const wantsEmail = form.get('email') === 'on';
    let summary: AnnouncementEmailSummary = { attempted: 0, sent: 0, failed: 0 };

    if (wantsEmail) {
      const env = getEnv();
      if (isFamilyEmailReady(env)) {
        const recipients = await getAnnouncementRecipientEmails(
          db,
          data.audience === 'class' ? data.classId! : null
        );
        summary = await sendAnnouncementEmails(recipients, (to) =>
          sendEmail(env, {
            to,
            subject: data.title,
            html: `<h2>${escapeHtml(data.title)}</h2><p>${escapeHtml(
              data.body
            ).replace(/\n/g, '<br>')}</p>`,
            text: `${data.title}\n\n${data.body}`,
          })
        );
      }
    }
    return redirect(
      addFlash(
        back,
        familyEmailResultMessage(wantsEmail, getEnv(), summary)
      ),
      303
    );
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'delete') {
    await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
    return redirect(addFlash(back, 'Announcement deleted.'), 303);
  }

  return badRequest('Unknown action');
};
