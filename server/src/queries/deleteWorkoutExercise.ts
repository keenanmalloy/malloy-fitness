import { db } from 'config/db';

interface DeleteWorkoutExerciseParams {
  workoutExerciseId: string;
}

export const deleteWorkoutExercise = async ({
  workoutExerciseId,
}: DeleteWorkoutExerciseParams): Promise<string> => {
  const query = `DELETE FROM workout_exercises WHERE workout_exercise_id = $1 RETURNING exercise_id`;
  const data = await db.query(query, [workoutExerciseId]);
  return data.rows[0].exercise_id;
};
