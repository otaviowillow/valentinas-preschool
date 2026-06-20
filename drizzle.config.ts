import { defineConfig } from 'drizzle-kit';

// Generates SQL migrations from src/db/schema.ts into drizzle/migrations.
// Apply them to D1 with wrangler (see package.json db:migrate* scripts).
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
});
