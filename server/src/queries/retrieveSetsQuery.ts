import { db } from 'config/db';
import { Response } from 'express';

export const retrieveSetsQuery = async (
  res: Response,
  workoutId: string
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const query = `SELECT * FROM sets LEFT JOIN sessions ON sessions.session_id = sets.session_id WHERE sessions.session_id = $1 AND sessions.created_by = $2`;
  const params = [workoutId, accountId];

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
