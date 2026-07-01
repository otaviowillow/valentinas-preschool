export const prerender = false;

import type { APIRoute } from 'astro';
import { eq, isNotNull } from 'drizzle-orm';
import { dbFrom, getEnv, schema } from '../../../db';
import { buildHolidayNoticeBody, getHolidaySchedule } from '../../../lib/holidays';
import { holidayInput, holidayScheduleInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { escapeHtml, sendEmail } from '../../../lib/email';
import {
  holidayNoticeResultMessage,
  isFamilyEmailReady,
} from '../../../lib/email-setup';

async function saveHolidaySchedule(
  db: ReturnType<typeof dbFrom>,
  data: { holidayScheduleTitle: string; holidayScheduleIntro: string }
) {
  await db
    .insert(schema.settings)
    .values({ id: 1, ...data })
    .onConflictDoUpdate({
      target: schema.settings.id,
      set: { ...data, updatedAt: new Date() },
    });
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/settings/');

  if (action === 'update_schedule') {
    const parsed = holidayScheduleInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the schedule title and intro.'), 303);
    }
    const data = parsed.data;
    await saveHolidaySchedule(db, data);
    return redirect(addFlash(back, 'Holiday schedule saved.'), 303);
  }

  if (action === 'add') {
    const parsed = holidayInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the holiday dates.'), 303);
    }
    const data = parsed.data;
    await db.insert(schema.holidays).values({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
    });
    return redirect(addFlash(back, 'Holiday added.'), 303);
  }

  if (action === 'delete') {
    const id = Number(form.get('id'));
    if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');
    await db.delete(schema.holidays).where(eq(schema.holidays.id, id));
    return redirect(addFlash(back, 'Holiday removed.'), 303);
  }

  if (action === 'send_notice') {
    const parsed = holidayScheduleInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the schedule title and intro.'), 303);
    }
    await saveHolidaySchedule(db, parsed.data);

    const schedule = await getHolidaySchedule();
    const title = schedule.title.trim() || 'Holiday schedule';
    const body = buildHolidayNoticeBody(schedule);

    await db.insert(schema.announcements).values({
      title,
      body,
      audience: 'all',
      classId: null,
      publishedAt: new Date(),
    });

    const wantsEmail = form.get('email') === 'on';
    let recipientCount = 0;

    if (wantsEmail) {
      const env = getEnv();
      if (isFamilyEmailReady(env)) {
        const recipients = await familyEmails(db);
        recipientCount = recipients.length;
        for (const to of recipients) {
          await sendEmail(env, {
            to,
            subject: title,
            html: `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(body).replace(
              /\n/g,
              '<br>'
            )}</p>`,
          });
        }
      }
    }

    return redirect(
      addFlash(
        back,
        holidayNoticeResultMessage(wantsEmail, getEnv(), recipientCount)
      ),
      303
    );
  }

  return badRequest('Unknown action');
};

async function familyEmails(
  db: ReturnType<typeof dbFrom>
): Promise<string[]> {
  const rows = await db
    .select({ email: schema.families.email })
    .from(schema.families)
    .where(isNotNull(schema.families.email));
  return [...new Set(rows.map((r) => r.email).filter((v): v is string => !!v))];
}
