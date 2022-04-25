import { db } from 'config/db';

export const endSessionMutation = async (res: any, id: string) => {
  const query = `
    UPDATE sessions
    SET ended_at = $1, completed = true
    WHERE session_id = $2 AND created_by = $3
    RETURNING *;
  `;

  const startedAt = new Date();
  const accountId = res.locals.state.account.account_id;
  const params = [startedAt, id, accountId];

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
