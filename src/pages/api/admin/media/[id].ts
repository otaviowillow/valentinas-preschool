export const prerender = false;

import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { dbFrom, getEnv, schema } from '../../../../db';
import { notFound } from '../../../../lib/admin';

// Streams an uploaded photo from R2 by its DB id. Admin-gated via middleware
// (path is under /api/admin). Used to render thumbnails in the comms gallery.
export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) return notFound();

  const db = dbFrom();
  const [photo] = await db
    .select()
    .from(schema.photos)
    .where(eq(schema.photos.id, id));
  if (!photo) return notFound();

  const env = getEnv();
  const object = await env.MEDIA.get(photo.r2Key);
  if (!object) return notFound();

  const headers = new Headers();
  const contentType = object.httpMetadata?.contentType;
  if (contentType) headers.set('content-type', contentType);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'private, max-age=3600');
  return new Response(object.body as unknown as BodyInit, { headers });
};
