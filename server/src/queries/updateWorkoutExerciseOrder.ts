import { db } from 'config/db';

interface UpdateWorkoutExerciseOrder {
  workoutId: string;
  exerciseOrder: string;
}

export const updateWorkoutExerciseOrder = async ({
  workoutId,
  exerciseOrder,
}: UpdateWorkoutExerciseOrder): Promise<string> => {
  const query = `UPDATE workouts SET exercise_order = $1 WHERE workout_id = $2 RETURNING workout_id`;
  const data = await db.query(query, [exerciseOrder, workoutId]);
  return data.rows[0].workout_id;
};
