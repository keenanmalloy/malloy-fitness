import { db } from 'config/db';

interface CreateAccountSettings {
  accountId: string;
}

export const createAccountSettings = async ({
  accountId,
}: CreateAccountSettings): Promise<string> => {
  const query = `INSERT INTO settings (account_id) VALUES ($1) RETURNING account_id`;
  const data = await db.query(query, [accountId]);
  return data.rows[0];
};
