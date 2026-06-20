// Shared helpers for admin API endpoints (form POST -> mutate D1 -> redirect).

/** Resolve where to send the user after a mutation. */
export function redirectTarget(form: FormData, fallback: string): string {
  const to = String(form.get('_redirect') ?? '').trim();
  // Only allow same-site relative paths.
  return to.startsWith('/') ? to : fallback;
}

export function badRequest(message: string): Response {
  return new Response(message, {
    status: 400,
    headers: { 'content-type': 'text/plain' },
  });
}

export function notFound(): Response {
  return new Response('Not found', {
    status: 404,
    headers: { 'content-type': 'text/plain' },
  });
}

export function appendParam(url: string, key: string, value: string): string {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}${key}=${encodeURIComponent(value)}`;
}
export const addFlash = (url: string, msg: string) =>
  appendParam(url, 'flash', msg);
export const addError = (url: string, msg: string) =>
  appendParam(url, 'error', msg);
