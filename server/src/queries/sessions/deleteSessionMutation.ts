import { db } from 'config/db';
import { Response } from 'express';

export const deleteSessionMutation = async (res: Response, id: string) => {
  const query = `DELETE FROM sessions WHERE session_id = $1 RETURNING *;`;
  const params = [id];

  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'session does not exist',
        session: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'session deleted successfully',
      session: data.rows[0],
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
