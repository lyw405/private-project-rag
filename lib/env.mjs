import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import 'dotenv/config';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string().min(1),
    EMBEDDING: z.string().min(1),
    AI_KEY: z.string().min(1),
    AI_BASE_URL: z.string().min(1),
    MODEL: z.string().optional().default('gpt-3.5-turbo'),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    EMBEDDING: process.env.EMBEDDING,
    AI_KEY: process.env.AI_KEY,
    AI_BASE_URL: process.env.AI_BASE_URL,
    MODEL: process.env.MODEL,
  },
});