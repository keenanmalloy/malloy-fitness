import { db } from 'config/db';

interface Response {
  status: string;
  message: string;
  sets: any;
}

export const retrieveSetsByExerciseQuery = async (
  res: any,
  workoutId: any,
  exerciseId: any
): Promise<Response> => {
  const query = `SELECT * FROM sets WHERE workout_id = $1 AND exercise_id = $2`;
  const params = [workoutId, exerciseId];

  try {
    const data = await db.query(query, params);

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Sets fetched successfully',
      status: 'success',
      sets: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      exercise: null,
    });
  }
};
