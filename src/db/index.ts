// D1 + Drizzle client helpers.
//
// Astro v6 on Cloudflare exposes bindings via the `cloudflare:workers` module
// (the old `Astro.locals.runtime.env` was removed). This works in `astro dev`
// (through the adapter's platformProxy) and in the deployed Worker alike.

import { drizzle } from 'drizzle-orm/d1';
import { env } from 'cloudflare:workers';
import * as schema from './schema';

export { schema };
export { env };

export function getEnv(): Env {
  return env;
}

export function getDb() {
  return drizzle(env.DB, { schema });
}

export type DB = ReturnType<typeof getDb>;

/** Convenience alias used across admin routes. */
export const dbFrom = (): DB => getDb();
