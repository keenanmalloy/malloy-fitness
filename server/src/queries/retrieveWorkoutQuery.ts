import { db } from 'config/db';

export const retrieveWorkoutQuery = async (
  workoutId: string,
  accountId: string
) => {
  const query = `SELECT 
      workouts.name as name,
      workouts.description as description,
      workouts.category as category,
      workouts.workout_id,
      workouts.type,
      workouts.created_by,
      workouts.exercise_order,
      we.exercise_id,
      we.workout_exercise_id
    FROM workouts
    LEFT OUTER JOIN workout_exercises we on workouts.workout_id = we.workout_id
    WHERE workouts.workout_id = $1`;
  const params = [workoutId];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return null;
    }

    // Because of the LEFT OUTER JOIN, we return a single exercise with a null id.
    // Check if it exists and return an empty array if it does not.
    const workoutExercises = !data.rows[0].exercise_id
      ? []
      : data.rows.map((we) => {
          return {
            exerciseId: we.exercise_id,
            notes: data.rows[0].created_by === accountId ? we.notes : null,
            sets: we.sets,
            repetitions: we.repetitions,
            reps_in_reserve: we.reps_in_reserve,
            rest_period: we.rest_period,
            workout_exercise_id: we.workout_exercise_id,
          };
        });

    const workout = {
      name: data.rows[0].name,
      description: data.rows[0].description,
      category: data.rows[0].category,
      workout_id: data.rows[0].workout_id,
      type: data.rows[0].type,
      exercise_order: data.rows[0].exercise_order,
      workoutExercises,
    };

    return workout;
  } catch (error) {
    return null;
  }
};
