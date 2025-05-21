import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

const connectionString = process.env.NODE_ENV != 'test' ? process.env.DATABASE_URL : process.env.DATABASE_URL_TEST;

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

