import { db } from 'config/db';

interface QueryParams {
  sessionId: string;
}

export const queryExerciseToContinueFrom = async ({
  sessionId,
}: QueryParams) => {
  const query = `
    SELECT
      sets.updated_at,
      e.exercise_id,
          sets.session_id
      FROM sets
      JOIN exercises e
          on sets.exercise_id = e.exercise_id
      WHERE session_id = $1
      ORDER BY sets.updated_at DESC LIMIT 1;
    `;

  const params = [sessionId];
  const data = await db.query(query, params);
  if (!data.rowCount) throw new Error('No exercise to continue from');
  return data.rows[0];
};
