import { db } from 'config/db';
import { Response } from 'express';

export const fetchGoalsQuery = async (res: Response) => {
  const accountId = res.locals.state.account.account_id;
  const query = `SELECT 
    daily_steps_goal,
    weekly_cardio_minutes_goal,
    body_weight_goal
  FROM settings WHERE account_id = $1`;
  const params = [accountId];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      throw new Error('Could not fetch goals');
    }

    const goals = data.rows[0];
    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Goals feError fetching Goals',
      goals,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      goals: null,
    });
  }
};
