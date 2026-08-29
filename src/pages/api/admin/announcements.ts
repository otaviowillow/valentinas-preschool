export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, getEnv, schema } from '../../../db';
import { announcementInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { CONTACT_EMAIL, escapeHtml, sendEmail } from '../../../lib/email';
import {
  sendAnnouncementEmails,
  type AnnouncementEmailSummary,
} from '../../../lib/announcements';
import {
  familyEmailResultMessage,
  isFamilyEmailReady,
} from '../../../lib/email-setup';
import { getAnnouncementRecipientEmails } from '../../../lib/announcement-recipients';

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 15 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);

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
    const attachedFiles = form
      .getAll('attachment')
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (attachedFiles.some((file) => file.size > MAX_ATTACHMENT_BYTES)) {
      return redirect(addError(back, 'An attachment is too large (max 10 MB each).'), 303);
    }
    if (
      attachedFiles.reduce((total, file) => total + file.size, 0) >
      MAX_TOTAL_ATTACHMENT_BYTES
    ) {
      return redirect(addError(back, 'Attachments exceed the 15 MB total limit.'), 303);
    }
    if (attachedFiles.some((file) => !ALLOWED_ATTACHMENT_TYPES.has(file.type))) {
      return redirect(
        addError(back, 'Attach an image, PDF, Word document, or text file.'),
        303
      );
    }

    await db.insert(schema.announcements).values({
      title: data.title,
      body: data.body,
      audience: data.audience,
      classId: data.audience === 'class' ? (data.classId ?? null) : null,
      publishedAt: new Date(),
    });

    let summary: AnnouncementEmailSummary = { attempted: 0, sent: 0, failed: 0 };

    const env = getEnv();
    if (isFamilyEmailReady(env)) {
      const familyRecipients = await getAnnouncementRecipientEmails(
        db,
        data.audience === 'class' ? (data.classId ?? null) : null
      );
      const recipients = [...new Set([...familyRecipients, CONTACT_EMAIL])];
      const attachments = await Promise.all(
        attachedFiles.map(async (file) => ({
          filename: file.name,
          contentType: file.type,
          data: await file.arrayBuffer(),
        }))
      );
      summary = await sendAnnouncementEmails(recipients, (to) =>
        sendEmail(env, {
          to,
          subject: data.title,
          html: `<h2>${escapeHtml(data.title)}</h2><p>${escapeHtml(
            data.body
          ).replace(/\n/g, '<br>')}</p>`,
          text: `${data.title}\n\n${data.body}`,
          attachments,
        })
      );
    }
    return redirect(
      addFlash(
        back,
        familyEmailResultMessage(getEnv(), summary)
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
