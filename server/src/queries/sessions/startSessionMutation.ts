import { db } from 'config/db';
import { Response } from 'express';

export const startSessionMutation = async (res: Response, id: string) => {
  const query = `
    UPDATE sessions
    SET started_at = CURRENT_TIMESTAMP, session_dt = CURRENT_TIMESTAMP
    WHERE session_id = $1 AND created_by = $2
    RETURNING *;
  `;

  const accountId = res.locals.state.account.account_id;
  const params = [id, accountId];

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
      message: 'session updated successfully',
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
