// ! Keep dotent.config at the very beginning of the file!!!
import dotenv from 'dotenv';

const envFile = '.env';
dotenv.config({ path: envFile });

export * from './application';
export * from './providers';
export * from './db';
