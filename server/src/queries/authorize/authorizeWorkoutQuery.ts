import { db } from 'config/db';
import { Response } from 'express';

export const authorizeWorkoutQuery = async (
  res: Response,
  workoutId: string
): Promise<{
  isAuthorized: boolean;
  createdBy: null | number;
}> => {
  const accountId = res.locals.state.account.account_id;
  const httpMethod = res.locals.state.httpMethod;

  const query = `SELECT 
        name,
        created_by,
        workout_id
    FROM workouts
    WHERE 
        workout_id = $1 AND created_by = $2 OR 
        workout_id = $1 AND created_by IS NULL`;
  const params = [workoutId, accountId];

  try {
    const data = await db.query(query, params);

    if (!data.rows.length) {
      return {
        isAuthorized: false,
        createdBy: null,
      };
    }

    return {
      isAuthorized: !!data.rows[0].created_by || httpMethod === 'GET',
      createdBy: data.rows[0].created_by,
    };
  } catch (error) {
    console.log({ error });
    return {
      isAuthorized: false,
      createdBy: null,
    };
  }
};
