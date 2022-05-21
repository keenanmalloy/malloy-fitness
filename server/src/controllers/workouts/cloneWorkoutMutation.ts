import { db } from 'config/db';
import { Response } from 'express';
import { inferCloneName } from 'utils/inferCloneName';

export const cloneWorkoutMutation = async (
  res: Response,
  workoutId: string
) => {
  const accountId = res.locals.state.account.account_id;

  try {
    const workout = await retrieveWorkoutQuery(workoutId, accountId);
    if (!workout) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        message: 'Failed',
        error: 'Workout failed to fetch, does it exist?',
      });
    }

    const taskOrder = JSON.stringify(
      workout.workoutExercises.map((e) => {
        return e.exerciseId;
      })
    );

    const workoutQuery = `
      WITH
        workoutdata(name, description, category, created_by, type, task_order) AS (
          VALUES
              ('${inferCloneName(workout.name)}', '${workout.description}', '${
      workout.category
    }', ${accountId}, '${workout.type}', '${taskOrder}'::jsonb)
          )
        INSERT INTO workouts (name, description, category, created_by, type, task_order)
          SELECT *
            FROM workoutdata
          RETURNING *
      `;

    const data = await db.query(workoutQuery);
    const createdWorkoutId = data.rows[0].workout_id;

    const generateWeValues = () => {
      return workout.workoutExercises
        .map(
          (we) =>
            `(${createdWorkoutId}, 
              ${we.exerciseId}, 
              ${we.notes ?? null}, 
              ${we.sets ?? null}, 
              ${we.repetitions ?? null}, 
              ${we.reps_in_reserve ?? null}, 
              ${we.rest_period ?? null})`
        )
        .join(',');
    };

    if (!workout.workoutExercises.length) {
      return res.status(201).json({
        role: res.locals.state.account.role,
        message: 'Workout Successfully Cloned',
        workoutId: createdWorkoutId,
      });
    }

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

    await db.query(weQuery);

    return res.status(201).json({
      role: res.locals.state.account.role,
      message: 'Workout Successfully Cloned',
      workoutId: createdWorkoutId,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: 'Failed',
      error: 'Workout failed to clone',
    });
  }
};

const retrieveWorkoutQuery = async (workoutId: string, accountId: string) => {
  const query = `SELECT 
  workouts.name as name,
  workouts.description as description,
  workouts.category as category,
  workouts.workout_id,
  workouts.type,
  workouts.created_by,
  workouts.task_order,
  we.exercise_id
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
          };
        });

    const workout = {
      name: data.rows[0].name,
      description: data.rows[0].description,
      category: data.rows[0].category,
      workout_id: data.rows[0].workout_id,
      type: data.rows[0].type,
      task_order: data.rows[0].task_order,
      workoutExercises,
    };

    return workout;
  } catch (error) {
    console.log({ error });
    return null;
  }
};
