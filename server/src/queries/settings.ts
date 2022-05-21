import { db } from 'config/db';

interface GetGoalSettings {
  accountId: string;
}

export const getGoalSettings = async ({ accountId }: GetGoalSettings) => {
  const query = `SELECT * FROM settings WHERE account_id = $1`;
  const data = await db.query(query, [accountId]);
  return data.rows[0];
};

export const queryGoalSettings = async (accountId: string) => {
  const query = `SELECT 
      daily_steps_goal,
      weekly_cardio_minutes_goal,
      body_weight_goal
    FROM settings WHERE account_id = $1`;
  const data = await db.query(query, [accountId]);
  if (!data.rows.length) {
    throw new Error('Could not fetch goals');
  }
  return data.rows[0];
};
