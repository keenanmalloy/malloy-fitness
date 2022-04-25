import { db } from 'config/db';
import { Response } from 'express';

export const retrieveSetsByExerciseQuery = async (
  res: Response,
  sessionId: any,
  exerciseId: any
) => {
  const query = `SELECT * FROM sets WHERE session_id = $1 AND exercise_id = $2`;
  const params = [sessionId, exerciseId];

  try {
    const data = await db.query(query, params);

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Sets fetched successfully',
      status: 'success',
      sets: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      exercise: null,
    });
  }
};
