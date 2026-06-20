// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Production domain (register valentinaspreschool.com — confirmed available).
  // Required for correct absolute URLs in the sitemap, canonical tags, and Open Graph.
  site: 'https://www.valentinaspreschool.com',

  // Static by default: marketing pages prerender to ./dist (fast, free, served
  // via the ASSETS binding). Only routes that opt out with `export const
  // prerender = false` (the /admin panel and /api endpoints) run on-demand in
  // the Cloudflare Worker, where they can reach the D1 + R2 bindings.
  output: 'static',
  adapter: cloudflare({
    // Lets `astro dev` reach the D1/R2 bindings locally via Miniflare.
    platformProxy: { enabled: true },
  }),

  integrations: [sitemap()],
  trailingSlash: 'always',
});