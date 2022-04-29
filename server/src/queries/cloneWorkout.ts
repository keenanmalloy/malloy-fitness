import { db } from 'config/db';
import { retrieveWorkoutQuery } from 'queries/retrieveWorkoutQuery';
import { inferCloneName } from 'utils/inferCloneName';

interface CloneWorkoutParams {
  workoutId: string;
  accountId: string;
}

export const cloneWorkout = async ({
  workoutId,
  accountId,
}: CloneWorkoutParams) => {
  const workout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!workout) throw new Error('Workout not found');
  const workoutQuery = `
          WITH
            workoutdata(name, description, category, created_by, type) AS (
              VALUES
                  ('${inferCloneName(workout.name)}', '${
    workout.description
  }', '${workout.category}', ${accountId}, '${workout.type}')
              )
            INSERT INTO workouts (name, description, category, created_by, type)
              SELECT *
                FROM workoutdata
              RETURNING *
          `;

  const data = await db.query(workoutQuery);
  const createdWorkoutId = data.rows[0].workout_id;
  return {
    oldWorkout: workout,
    newWorkoutId: createdWorkoutId,
  };
};
