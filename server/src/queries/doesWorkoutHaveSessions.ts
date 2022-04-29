import { db } from 'config/db';

export const doesWorkoutHaveSessions = async (workoutId: string) => {
  const query = `SELECT session_id FROM sessions WHERE workout_id = $1`;
  const params = [workoutId];
  const data = await db.query(query, params);
  if (!data) return false;
  return !!data.rows.length;
};
