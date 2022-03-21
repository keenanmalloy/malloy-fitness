import { db } from "config/db";

export const authorizeWorkoutQuery = async (
  workoutId: string,
  accountId: string
): Promise<boolean> => {
  const query = `SELECT 
        name,
        created_by,
        workout_id
    FROM workouts
    WHERE 
        workout_id = $1 AND created_by = $2 OR 
        workout_id = $1 AND created_by IS NULL`;
  const params = [workoutId, accountId];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return false;
    }

    return true;
  } catch (error) {
    console.log({ error });
    return false;
  }
};
