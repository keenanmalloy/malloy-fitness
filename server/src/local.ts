import isPortReachable from 'is-port-reachable';
import path from 'path';
import dockerCompose from 'docker-compose';
import { Client } from 'pg';
import { loadMigrationFiles, migrate } from 'postgres-migrations';

/**
 * Starts the server and the database locally and applies the migrations.
 */
(async () => {
  try {
    // ️️️✅ Best Practice: Speed up during development, if already live then do nothing
    const isDBReachable = await isPortReachable(45432, { host: 'localhost' });
    if (!isDBReachable) {
      // ️️️✅ Best Practice: Start the infrastructure within a test hook - No failures occur because the DB is down
      await dockerCompose.upAll({
        cwd: path.join(__dirname),
        log: true,
      });

      await dockerCompose.exec(
        'postgres',
        ['sh', '-c', 'until pg_isready ; do sleep 1; done'],
        {
          cwd: path.join(__dirname),
        }
      );

      // ️️️✅ Best Practice - run migrations after the DB is up
      await runMigrations();

      await dockerCompose.logs(['postgres', 'api.trckd'], {
        cwd: path.join(__dirname),
        log: true,
        follow: true,
      });
    }
  } catch (error) {
    console.log({ error });
  }
})();

class MigrationFileError extends Error {}
class DBConnectionError extends Error {}

async function runMigrations() {
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
    connectionString: `postgres://postgres:password@localhost:45432/postgres`,
    application_name: 'tracked',
    ssl: false,
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
}
