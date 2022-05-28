import { db } from 'config/db';
import { settings_table } from 'utils/databaseTypes';

interface GetGoalSettings {
  accountId: string;
}

export const getGoalSettings = async ({ accountId }: GetGoalSettings) => {
  const query = `SELECT * FROM settings WHERE account_id = $1`;
  const data = await db.query<settings_table>(query, [accountId]);
  return data.rows[0];
};

export const queryGoalSettings = async (accountId: string) => {
  const query = `SELECT 
      daily_steps_goal,
      weekly_cardio_minutes_goal,
      body_weight_goal
    FROM settings WHERE account_id = $1`;
  const data = await db.query<
    Pick<
      settings_table,
      'body_weight_goal' | 'daily_steps_goal' | 'weekly_cardio_minutes_goal'
    >
  >(query, [accountId]);
  if (!data.rows.length) {
    throw new Error('Could not fetch goals');
  }
  return data.rows[0];
};
