import { db } from 'config/db';
import {
  exercises_table,
  workout_tasks_table,
  workout_task_exercises_table,
} from 'utils/databaseTypes';

export const queryMainExercise = async (workoutTaskId: string) => {
  const query = `SELECT
        exercises.exercise_id,
        exercises.name,
        exercises.description,
        exercises.category,
        workouts.task_order,
        video,
        profile,
        exercises.view,
        sessions.workout_id,
        wc.workout_task_id,
        wce.workout_task_exercise_id
    FROM exercises
    JOIN workout_task_exercises wce
       ON exercises.exercise_id = wce.exercise_id
    JOIN workout_tasks
      ON wce.workout_task_id = workout_task.workout_task_id
    JOIN sessions 
      ON sessions.workout_id = workout_task_id.workout_id
    JOIN workouts 
      ON workouts.workout_id = sessions.workout_id
    WHERE
      workout_tasks = $1
    `;

  const data = await db.query(query, [workoutTaskId]);
  return data.rows[0];
};

export const fetchSessionExercises = async (sessionId: string) => {
  const query = `
    SELECT 
      e.exercise_id,
      e.name,
      repetitions,
      reps_in_reserve,
      sets,
      rest_period,
      wt.workout_task_id,
      wte.workout_task_exercise_id
    FROM exercises e
    JOIN workout_task_exercises wte on e.exercise_id = wte.exercise_id
    JOIN workout_tasks wt on wt.workout_task_id = wte.workout_task_id
    JOIN workouts w on wte.workout_id = w.workout_id
    JOIN sessions s on s.workout_id = w.workout_id
    WHERE session_id = $1`;

  const params = [sessionId];
  const data = await db.query<
    Pick<exercises_table, 'exercise_id' | 'name'> &
      Pick<
        workout_task_exercises_table,
        | 'repetitions'
        | 'reps_in_reserve'
        | 'rest_period'
        | 'sets'
        | 'workout_task_exercise_id'
        | 'workout_task_id'
      >
  >(query, params);
  return data.rows;
};

export const queryExercisesBySession = async (sessionId: string) => {
  const query = `
    SELECT
      e.exercise_id,
      e.name,
      e.video,
      primary_tracker,
      secondary_tracker,
      wt.workout_task_id,
      wte.workout_task_exercise_id
    FROM sessions
      LEFT JOIN workouts ON workouts.workout_id = sessions.workout_id
      LEFT JOIN workout_tasks wt ON workouts.workout_id = wt.workout_id
      LEFT JOIN workout_task_exercises wte ON wt.workout_task_id = wte.workout_task_id
      LEFT JOIN exercises e on wte.exercise_id = e.exercise_id
    WHERE sessions.session_id = $1`;
  const params = [sessionId];
  const data = await db.query<
    Pick<
      exercises_table,
      'exercise_id' | 'name' | 'video' | 'primary_tracker' | 'secondary_tracker'
    > &
      Pick<workout_tasks_table, 'workout_task_id'> &
      Pick<workout_task_exercises_table, 'workout_task_exercise_id'>
  >(query, params);
  return data.rows;
};
