import { Pool } from 'pg';

export const db = new Pool({
  max: 20,
  connectionString:
    process.env.NODE_ENV === 'test'
      ? 'postgres://postgres:password@localhost:4444/postgres'
      : process.env.DATABASE_URL,
  application_name: 'malloy-fitness',
  ssl: false,
  connectionTimeoutMillis: 10000,
});
