import type { Config } from 'drizzle-kit';

export default {
  schema: './db//schema.ts',
  dialect: 'postgresql',
  out: './db/migrations',
  dbCredentials: {
    url: 'postgresql://postgres.egqxpvpblmaitfteftol:pIzSYE4bv7UvlV0y@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
  },
  tablesFilter: ['!langchain_embeddings', '!llamaindex_embeddings']
} satisfies Config;
