import { db } from 'config/db';

export const MAX_EXERCISES_IN_SUPERSET = 5;

/**
 * Returns the workout_task_id after inserting the row
 */
const createWorkoutTask = async (workoutId: string): Promise<string> => {
  const query = `INSERT INTO workout_tasks (workout_id) VALUES ('${workoutId}') RETURNING workout_task_id`;
  const data = await db.query(query);
  return data.rows[0].workout_task_id;
};

type Exercise = {
  exercise_id: string;

  sets?: string | null;
  repetitions?: string | null;
  reps_in_reserve?: string | null;
  rest_period?: string | null;
};

interface CreateWorkoutTaskWithExercisesParams {
  workoutId: string;
  payload: Exercise | Exercise[];
}

const generateValues = (
  payload: Exercise[],
  workoutId: string,
  workoutTaskId: string
) => {
  return payload
    .map(
      (wte) =>
        `(${workoutId}, 
          ${wte.exercise_id}, 
          ${workoutTaskId},
          ${wte.sets ?? null}, 
          ${wte.repetitions ?? null}, 
          ${wte.reps_in_reserve ?? null}, 
          ${wte.rest_period ?? null})`
    )
    .join(',');
};

/**
 * Inserts a row in workout_tasks
 * Inserts rows for each exercise to workout_task_exercises
 * Returns the workout_task_id after inserting the row(s)
 *
 * Throws an error if more than ```MAX_EXERCISES_IN_SUPERSET``` exercises are passed
 *
 * returns the ```workout_task_id```
 */
export const createWorkoutTaskWithExercises = async ({
  workoutId,
  payload,
}: CreateWorkoutTaskWithExercisesParams): Promise<string> => {
  if (Array.isArray(payload)) {
    if (payload.length > MAX_EXERCISES_IN_SUPERSET) {
      throw new Error(
        `Cannot add more than ${MAX_EXERCISES_IN_SUPERSET} exercises to a superset`
      );
    }

    const workoutTaskId = await createWorkoutTask(workoutId);
    const query = `
      WITH
        data(workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period) AS (
          VALUES
            ${generateValues(payload, workoutId, workoutTaskId)}
          )
        INSERT INTO workout_task_exercises (workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period)
          SELECT workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period
            FROM data
          RETURNING *
  `;

    const data = await db.query(query);
    return data.rows[0].workout_task_id;
  }

  const query = `
    WITH
      Task as (
        INSERT INTO workout_tasks (workout_id) VALUES (${workoutId})
        RETURNING workout_task_id
      ),
      data(workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period) AS (
        VALUES
            (
              ${workoutId}, 
              ${payload.exercise_id}, 
              (SELECT workout_task_id FROM Task),
              ${payload.sets ?? null}, 
              ${payload.repetitions ?? null}, 
              ${payload.reps_in_reserve ?? null}, 
              ${payload.rest_period ?? null}
            )
        )
      INSERT INTO workout_task_exercises (workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period)
        SELECT workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period
          FROM data
        RETURNING *
  `;

  const data = await db.query(query);
  return data.rows[0].workout_task_id;
};

/**
 * Deletes the workout_tasks row and returns the ```workout_task_id```
 * NOTE* This will also delete the connected workout_task_exercises rows
 * Throws error if workout Task not found
 */
export const deleteWorkoutTask = async (
  workoutTaskId: string
): Promise<void> => {
  const query = `DELETE FROM workout_tasks WHERE workout_task_id = $1`;
  const data = await db.query(query, [workoutTaskId]);
  if (!data.rowCount) throw new Error('Workout Task not found');
};

export type WorkoutTask = {
  workout_task_id: string;
  exercises: Exercise[];
};

interface CloneWorkoutTaskWithExercisesParams {
  newWorkoutId: string;
  payload: WorkoutTask[];
}

/**
 * Clone ```workout_tasks``` AND ```workout_task_exercises``` to a new workout
 */
export const cloneWorkoutTasksWithExercises = async ({
  newWorkoutId,
  payload,
}: CloneWorkoutTaskWithExercisesParams) => {
  const workoutTaskIds = await createWorkoutTaskBatch(
    newWorkoutId,
    payload.length
  );

  const query = `
      WITH
        data(workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period) AS (
          VALUES
            ${generateCloneValues(payload, newWorkoutId, workoutTaskIds)}
          )
        INSERT INTO workout_task_exercises (workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period)
          SELECT workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period
            FROM data
          RETURNING *
  `;

  const data = await db.query(query);
  return data.rows;
};

const generateCloneValues = (
  payload: WorkoutTask[],
  newWorkoutId: string,
  newWorkoutTaskIds: string[]
) => {
  return payload
    .map((task, index) => {
      return task.exercises
        .map((exercise) => {
          return `(${newWorkoutId}, 
                  ${exercise.exercise_id}, 
                  ${newWorkoutTaskIds[index]},
                  ${exercise.sets ?? null}, 
                  ${exercise.repetitions ?? null}, 
                  ${exercise.reps_in_reserve ?? null}, 
                  ${exercise.rest_period ?? null}
                )`;
        })
        .join(',');
    })
    .join(',');
};

/**
 * Returns the workout_task_ids after inserting batchAmount rows
 */
const createWorkoutTaskBatch = async (
  workoutId: string,
  batchAmount: number
): Promise<string[]> => {
  const values = [...Array(batchAmount)].map(() => `(${workoutId})`).join(',');
  const query = `INSERT INTO workout_tasks (workout_id) 
    VALUES 
      ${values}
    RETURNING workout_task_id`;
  const data = await db.query(query);
  if (!data.rowCount) throw new Error('Error inserting data for workout Task');
  return data.rows.map((row) => row.workout_task_id);
};
