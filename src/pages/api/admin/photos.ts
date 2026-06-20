export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, getEnv, schema } from '../../../db';
import { addError, addFlash, badRequest, redirectTarget } from '../../../lib/admin';
import { intOrNull, str } from '../../../lib/format';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const action = String(form.get('_action') ?? '');
  const db = dbFrom();
  const env = getEnv();
  const back = redirectTarget(form, '/admin/comms/');

  if (action === 'upload') {
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return redirect(addError(back, 'Choose an image to upload.'), 303);
    }
    if (file.size > MAX_BYTES) {
      return redirect(addError(back, 'Image is too large (max 10 MB).'), 303);
    }
    if (!ALLOWED.includes(file.type)) {
      return redirect(addError(back, 'Unsupported image type.'), 303);
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const key = `photos/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
    await env.MEDIA.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });

    await db.insert(schema.photos).values({
      r2Key: key,
      caption: str(form.get('caption')),
      classId: intOrNull(form.get('classId')),
      childId: intOrNull(form.get('childId')),
      takenAt: new Date(),
    });
    return redirect(addFlash(back, 'Photo uploaded.'), 303);
  }

  const id = Number(form.get('id'));
  if (!Number.isInteger(id) || id <= 0) return badRequest('Invalid id');

  if (action === 'delete') {
    const [photo] = await db
      .select()
      .from(schema.photos)
      .where(eq(schema.photos.id, id));
    if (photo) {
      await env.MEDIA.delete(photo.r2Key);
      await db.delete(schema.photos).where(eq(schema.photos.id, id));
    }
    return redirect(addFlash(back, 'Photo deleted.'), 303);
  }

  return badRequest('Unknown action');
};
