import { defineMiddleware } from 'astro:middleware';

// Gate the admin panel + its API. In production, Cloudflare Access sits in front
// of these paths (configured in the Zero Trust dashboard) and injects the
// authenticated user's email header after a successful login. This middleware is
// a server-side backstop: it refuses requests that didn't pass Access and makes
// the admin's email available as `Astro.locals.adminEmail`.
//
// Local dev has no Access in front, so we allow through with a placeholder email.

const isProtected = (pathname: string) =>
  pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isProtected(context.url.pathname)) return next();

  if (import.meta.env.DEV) {
    context.locals.adminEmail = 'dev@local';
    return next();
  }

  // Cloudflare Access sets this header only after a verified login. Because
  // Access enforces auth at the edge for these paths, its presence is
  // trustworthy here. (For extra defense-in-depth, verify the
  // `Cf-Access-Jwt-Assertion` JWT against the team JWKS.)
  const email = context.request.headers.get(
    'Cf-Access-Authenticated-User-Email'
  );

  if (!email) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'content-type': 'text/plain' },
    });
  }

  context.locals.adminEmail = email;
  return next();
});
