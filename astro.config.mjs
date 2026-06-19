// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production domain (register valentinaspreschool.com — confirmed available).
  // Required for correct absolute URLs in the sitemap, canonical tags, and Open Graph.
  site: 'https://www.valentinaspreschool.com',
  integrations: [sitemap()],
  trailingSlash: 'always',
});