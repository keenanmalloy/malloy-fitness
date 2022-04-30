import { db } from 'config/db';

interface updateWorkoutExerciseParams {
  workoutExerciseId: string;
  exerciseId: string;
}

export const updateWorkoutExercise = async ({
  workoutExerciseId,
  exerciseId,
}: updateWorkoutExerciseParams): Promise<string> => {
  const query = `UPDATE workout_exercises SET exercise_id = $1 WHERE workout_exercise_id = $2 RETURNING exercise_id`;
  const data = await db.query(query, [exerciseId, workoutExerciseId]);
  return data.rows[0].exercise_id;
};
