import { db } from "config/db";

export const authorizeExerciseQuery = async (
  exerciseId: string,
  accountId: string
): Promise<boolean> => {
  const query = `SELECT 
        name,
        created_by,
        exercise_id
    FROM exercises
    WHERE 
        exercise_id = $1 AND created_by = $2 OR 
        exercise_id = $1 AND created_by IS NULL`;
  const params = [exerciseId, accountId];

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
