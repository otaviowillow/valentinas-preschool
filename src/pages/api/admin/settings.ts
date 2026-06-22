export const prerender = false;

import type { APIRoute } from 'astro';
import { dbFrom, schema } from '../../../db';
import { settingsInput } from '../../../lib/validation';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const back = redirectTarget(form, '/admin/settings/');

  if (action === 'update') {
    const parsed = settingsInput.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      return redirect(addError(back, 'Check the settings values.'), 303);
    }
    const data = parsed.data;
    await db
      .insert(schema.settings)
      .values({ id: 1, ...data })
      .onConflictDoUpdate({
        target: schema.settings.id,
        set: { ...data, updatedAt: new Date() },
      });
    return redirect(addFlash(back, 'Settings saved.'), 303);
  }

  return badRequest('Unknown action');
};
