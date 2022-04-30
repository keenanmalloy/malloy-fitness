import { db } from 'config/db';
import { Response } from 'express';

export const authorizeSessionQuery = async (
  res: Response,
  sessionId: string
): Promise<{
  isAuthorized: boolean;
  createdBy: null | number;
}> => {
  const accountId = res.locals.state.account.account_id;
  const httpMethod = res.locals.state.httpMethod;

  const query = `SELECT 
        created_by,
        session_id
    FROM sessions
    WHERE 
        session_id = $1 AND created_by = $2`;
  const params = [sessionId, accountId];

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
