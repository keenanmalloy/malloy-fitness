import { db } from 'config/db';
import {
  exercises_table,
  sessions_table,
  workouts_table,
  workout_tasks_table,
  workout_task_exercises_table,
} from 'utils/databaseTypes';

interface updateTaskExerciseParams {
  workout_task_exercise_id: string;
  exercise_id: string;
}

/**
 * Update workout_task_exercises row with a new exercise_id
 * Returns the ```exercise_id``` after updating the row
 */
export const updateTaskExercise = async ({
  workout_task_exercise_id,
  exercise_id,
}: updateTaskExerciseParams): Promise<string> => {
  const query = `UPDATE workout_task_exercises SET exercise_id = $1 WHERE workout_task_exercise_id = $2 RETURNING workout_task_exercise_id`;
  const data = await db.query(query, [exercise_id, workout_task_exercise_id]);
  return data.rows[0].workout_task_exercise_id;
};

/**
 * Query exercises within a workout by ```workout_id```
 */
export const queryTaskExercisesByWorkoutId = async (workoutId: string) => {
  const query = `SELECT 
        workout_task_exercise_id,
        exercise_id,
        workout_task_id,
        sets,
        repetitions,
        reps_in_reserve,
        rest_period
    FROM workout_task_exercises
    WHERE workout_id = $1`;
  const params = [workoutId];

  const data = await db.query<workout_task_exercises_table>(query, params);
  return data.rows;
};

/**
 * Query ```exercise_id```'s within a workout by ```workout_id```
 */
export const queryExerciseIdsByWorkoutId = async (workoutId: string) => {
  const query = `SELECT 
        exercise_id
    FROM workout_task_exercises
    WHERE workout_id = $1`;
  const params = [workoutId];

  const data = await db.query<
    Pick<workout_task_exercises_table, 'exercise_id'>
  >(query, params);
  return data.rows;
};

/**
 * Delete exercise within a workout by ```workout_task_exercise_id```
 */
export const deleteTaskExerciseById = async (
  workout_task_exercise_id: string
) => {
  const query = `DELETE FROM workout_task_exercises WHERE workout_task_exercise_id = $1 RETURNING exercise_id`;
  const params = [workout_task_exercise_id];

  const data = await db.query<
    Pick<workout_task_exercises_table, 'exercise_id'>
  >(query, params);
  return data.rows[0].exercise_id;
};

interface TaskExercise {
  workout_id: string;
  exercise_id: string;
  workout_task_id: string;

  sets?: string;
  repetitions?: string;
  reps_in_reserve?: string;
  rest_period?: string;
}

export const createTaskExercise = async (
  payload: TaskExercise
): Promise<string> => {
  const query = `
  INSERT INTO workout_task_exercises (workout_id, exercise_id, workout_task_id, sets, repetitions, reps_in_reserve, rest_period)
  VALUES ($1, $2, $3, $4, $5, $6, $7) 
  RETURNING exercise_id`;

  const params = [
    payload.workout_id,
    payload.exercise_id,
    payload.workout_task_id,
    payload.sets ?? null,
    payload.repetitions ?? null,
    payload.reps_in_reserve ?? null,
    payload.rest_period ?? null,
  ];

  const data = await db.query(query, params);
  return data.rows[0].exercise_id;
};

export const queryWorkoutTaskExercisesByWorkoutTaskId = async (
  workoutTaskId: string
) => {
  const query = `SELECT
        exercises.exercise_id,
        exercises.name,
        exercises.description,
        exercises.category,
        exercises.view,
        exercises.video,
        exercises.profile,

        workouts.task_order,
      
        sessions.workout_id,

        wt.exercise_order,

        wte.workout_task_id,
        wte.workout_task_exercise_id

    FROM workout_task_exercises wte
    JOIN exercises exercises
       ON exercises.exercise_id = wte.exercise_id
    JOIN workout_tasks wt
      ON wt.workout_task_id = wte.workout_task_id
    JOIN sessions 
      ON sessions.workout_id = wt.workout_id
    JOIN workouts 
      ON workouts.workout_id = sessions.workout_id
    WHERE
      wt.workout_task_id = $1
    `;

  const data = await db.query<
    Pick<
      exercises_table,
      | 'exercise_id'
      | 'name'
      | 'description'
      | 'category'
      | 'view'
      | 'video'
      | 'profile'
    > &
      Pick<workouts_table, 'task_order'> &
      Pick<sessions_table, 'workout_id'> &
      Pick<
        workout_task_exercises_table,
        'workout_task_id' | 'workout_task_exercise_id'
      > &
      Pick<workout_tasks_table, 'exercise_order'>
  >(query, [workoutTaskId]);
  return data.rows;
};
