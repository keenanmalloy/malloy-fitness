import { db } from 'config/db';

interface DeleteSetsBySessionExercise {
  sessionId: string;
  exerciseId: string;
}

export const deleteSetsBySessionExercise = async ({
  sessionId,
  exerciseId,
}: DeleteSetsBySessionExercise): Promise<string> => {
  const query = `DELETE FROM sets WHERE session_id = $1 AND exercise_id = $2 RETURNING exercise_id`;
  const data = await db.query(query, [sessionId, exerciseId]);
  return data.rows[0];
};
