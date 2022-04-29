import { db } from 'config/db';

interface UpdateSessionWorkoutParams {
  sessionId: string;
  workoutId: string;
}

export const updateSessionWorkout = async ({
  sessionId,
  workoutId,
}: UpdateSessionWorkoutParams) => {
  const query = `UPDATE sessions SET workout_id = $1 WHERE session_id = $2 RETURNING session_id`;
  const data = await db.query(query, [workoutId, sessionId]);
  return data.rows[0];
};
