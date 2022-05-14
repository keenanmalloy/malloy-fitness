import { db } from 'config/db';

interface CloneParams {
  workoutId: string;
  workoutExercises: {
    exerciseId: string;
    repetitions: number;
    reps_in_reserve: number;
    rest_period: number;
    notes: string;
    sets: string;
  }[];
}

export const cloneWorkoutExercises = async ({
  workoutExercises,
  workoutId,
}: CloneParams) => {
  const generateWeValues = () => {
    return workoutExercises
      .map(
        (we) =>
          `(${workoutId}, 
                    ${we.exerciseId}, 
                    ${we.notes ?? null}, 
                    ${we.sets ?? null}, 
                    ${we.repetitions ?? null}, 
                    ${we.reps_in_reserve ?? null}, 
                    ${we.rest_period ?? null})`
      )
      .join(',');
  };

  const weQuery = `
              WITH
                wedata(workout_id, exercise_id, notes, sets, repetitions, reps_in_reserve, rest_period) AS (
                    VALUES 
                      ${generateWeValues()}
                  )
                INSERT INTO workout_exercises (workout_id, exercise_id, notes, sets, repetitions, reps_in_reserve, rest_period)
                  SELECT workout_id, exercise_id, notes, sets, repetitions, reps_in_reserve, rest_period
                    FROM wedata
                  RETURNING *
            `;

  const data = await db.query(weQuery);
  if (data.rowCount === 0) throw new Error('Could not clone workout exercises');
  return data.rows;
};
