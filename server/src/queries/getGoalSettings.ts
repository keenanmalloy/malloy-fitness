import { db } from 'config/db';

interface GetGoalSettings {
  accountId: string;
}

export const getGoalSettings = async ({ accountId }: GetGoalSettings) => {
  const query = `SELECT * FROM settings WHERE account_id = $1`;
  const data = await db.query(query, [accountId]);
  return data.rows[0];
};
