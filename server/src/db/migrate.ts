import dotenv from 'dotenv';
const envFile =
  process.env.NODE_ENV === 'test'
    ? `local.test.env`
    : process.env.NODE_ENV === 'staging'
    ? `local.staging.env`
    : 'local.test.env';

dotenv.config({ path: envFile });

import { Client } from 'pg';
import { loadMigrationFiles, migrate } from 'postgres-migrations';

class MigrationFileError extends Error {}
class DBConnectionError extends Error {}

(async function runMigrations() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.info(
    `STARTING MIGRATION ENVIRONMENT - ${
      process.env.NODE_ENV || 'development'
    } ⌛`
  );

  try {
    await loadMigrationFiles('src/db/migrations');
  } catch (error) {
    throw new MigrationFileError('Could not load migration files ❌');
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    application_name: 'tracked',
    ssl: process.env.TS_NODE_DEV === 'true' ? false : true,
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
  } catch (error) {
    console.error({ error });
    console.error(process.env);
    throw new DBConnectionError('Could not connect to database ❌');
  }

  try {
    console.info('APPLYING MIGRATION ⌛');
    await migrate({ client }, 'src/db/migrations');
    console.info('MIGRATION APPLIED ✅');
  } catch (e) {
    console.error('MIGRATION FAILED ❌', e);
    throw new MigrationFileError('Could not parse SQL ❌');
  } finally {
    await client.end();
  }
})();
