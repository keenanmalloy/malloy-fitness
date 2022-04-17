import { db } from 'config/db';

interface Response {
  status: string;
  message: string;
  exercise: any;
  error?: any;
}

export const removeExerciseFromWorkoutMutation = async (
  res: any,
  workoutId: string,
  exerciseId: string
): Promise<Response> => {
  const query = `DELETE FROM workout_exercises WHERE workout_id = $1 AND exercise_id = $2 RETURNING *;`;
  const params = [workoutId, exerciseId];
  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Exercise does not exist',
        exercise: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Exercise removed successfully',
      exercise: data.rows[0],
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
