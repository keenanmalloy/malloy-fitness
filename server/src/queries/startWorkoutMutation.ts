import { db } from 'config/db';
import { Response } from 'express';

export const startWorkoutMutation = async (res: Response, id: string) => {
  const query = `
    UPDATE workouts
    SET started_at = CURRENT_TIMESTAMP, workout_dt = CURRENT_TIMESTAMP
    WHERE workout_id = $1 AND created_by = $2
    RETURNING *;
  `;

  const accountId = res.locals.state.account.account_id;
  const params = [id, accountId];

  try {
    const data = await db.query(query, params);
    if (!data.rowCount) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout does not exist',
        workout: null,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Workout updated successfully',
      workout: data.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      workout: null,
    });
  }
};
