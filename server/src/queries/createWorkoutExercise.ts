import { db } from 'config/db';

interface CreateWorkoutExerciseParams {
  exerciseId: string;
  workoutId: string;
  order: number;
}

export const createWorkoutExercise = async ({
  exerciseId,
  workoutId,
  order,
}: CreateWorkoutExerciseParams): Promise<string> => {
  const query = `INSERT INTO workout_exercises (exercise_id, workout_id, "order") VALUES ('${exerciseId}', '${workoutId}', ${order}) RETURNING exercise_id`;
  const data = await db.query(query);
  return data.rows[0].exercise_id;
};
