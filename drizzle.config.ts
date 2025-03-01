import type { Config } from 'drizzle-kit';
import { env } from '@/lib/env.mjs';

export default {
  schema: './db/schema.ts',
  dialect: 'postgresql',
  out: './db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL
  },
  tablesFilter: ['!langchain_embeddings', '!llamaindex_embeddings']
} satisfies Config;
