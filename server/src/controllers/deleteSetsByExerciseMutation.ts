import { db } from 'config/db';
import { Response } from 'express';

export const deleteSetsByExerciseMutation = async (
  res: Response,
  sessionId: string,
  exerciseId: string
): Promise<Response> => {
  const query = `DELETE FROM sets WHERE session_id = $1 AND exercise_id = $2 RETURNING *;`;
  const params = [sessionId, exerciseId];

  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Sets do not exist',
        set: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Sets deleted successfully',
      sets: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      set: null,
    });
  }
};
