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
    // 'compile' optimizes images with Sharp at BUILD time for prerendered
    // pages (emitting static .webp), instead of the default runtime Cloudflare
    // Images service. All our marketing pages are static, so this gives real
    // pre-optimized files and a fast LCP with no runtime image endpoint.
    imageService: 'compile',
  }),

  integrations: [sitemap()],
  trailingSlash: 'always',

  // Inline all CSS into each document's <head> so the browser never blocks
  // first paint on a separate stylesheet request (helps FCP/LCP).
  build: {
    inlineStylesheets: 'always',
  },
});
