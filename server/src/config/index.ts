// ! Keep dotent.config at the very beginning of the file!!!
import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'test'
    ? `local.test.env`
    : process.env.NODE_ENV === 'development'
    ? 'local.dev.env'
    : process.env.NODE_ENV === 'staging'
    ? 'local.staging.env'
    : 'local.dev.env';
dotenv.config({ path: envFile });

export * from './application';
export * from './providers';
export * from './db';
