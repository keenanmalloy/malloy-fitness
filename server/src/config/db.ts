import { Pool } from 'pg';

export const db = new Pool({
  max: 20,
  connectionString: process.env.DATABASE_URL,
  application_name: 'malloy-fitness',
  ssl:
    process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
      ? false
      : {
          rejectUnauthorized: false,
        },
  connectionTimeoutMillis: 10000,
});
