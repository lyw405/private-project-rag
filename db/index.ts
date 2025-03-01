import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres('postgresql://postgres.egqxpvpblmaitfteftol:pIzSYE4bv7UvlV0y@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');
export const db = drizzle(client);

