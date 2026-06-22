/// <reference types="astro/client" />

// Cloudflare bindings + secrets, available via `import { env } from
// "cloudflare:workers"`. Augmenting Cloudflare.Env types that `env`.
declare namespace Cloudflare {
  interface Env {
    /** D1 database binding (see wrangler.jsonc). */
    DB: import('@cloudflare/workers-types').D1Database;
    /** R2 bucket for uploaded photos (parent comms). */
    MEDIA: import('@cloudflare/workers-types').R2Bucket;
    /** Static assets binding (managed by the @astrojs/cloudflare adapter). */
    ASSETS: import('@cloudflare/workers-types').Fetcher;
    /** KV for Astro sessions + intake rate limiting. */
    SESSION: import('@cloudflare/workers-types').KVNamespace;

    // ---- Secrets (set with `wrangler secret put <NAME>`; never commit) ------
    /** Resend API key for transactional/announcement email (optional). */
    RESEND_API_KEY?: string;
    /** Where new-inquiry notifications are sent (optional). */
    NOTIFY_EMAIL?: string;
    /** Cloudflare Access application audience (AUD) tag for JWT verification. */
    ACCESS_AUD?: string;
    /** Cloudflare Access team domain, e.g. https://<team>.cloudflareaccess.com */
    ACCESS_TEAM_DOMAIN?: string;
  }
}

type Env = Cloudflare.Env;

declare namespace App {
  interface Locals {
    /** Email of the authenticated admin (populated by middleware from Access). */
    adminEmail?: string;
  }
}
