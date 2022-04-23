import { db } from 'config/db';
import { Response } from 'express';

export const retrieveSessionQuery = async (res: Response, id: string) => {
  const query = `SELECT * FROM sessions WHERE session_id = $1`;
  const params = [id];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Session does not exist',
        session: null,
      });
    }

    const session = data.rows[0];

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Session fetched successfully',
      session,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      session: null,
    });
  }
};
