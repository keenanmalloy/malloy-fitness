import { db } from 'config/db';
import {
  exercises_table,
  sets_table,
  workout_task_exercises_table,
} from 'utils/databaseTypes';

export const querySetsBySession = async (sessionId: string) => {
  const query = `
    SELECT 
        s.set_id,
        s.repetitions,
        s.weight,
        e.exercise_id
      FROM sessions
    LEFT JOIN sets s on s.session_id = sessions.session_id
    LEFT JOIN exercises e on s.exercise_id = e.exercise_id
    WHERE sessions.session_id = $1  
    ORDER BY s.created_at ASC
    `;
  const params = [sessionId];
  const data = await db.query<
    Pick<sets_table, 'set_id' | 'repetitions' | 'exercise_id' | 'weight'>
  >(query, params);
  return data.rows;
};

interface DeleteSetsBySessionExercise {
  sessionId: string;
  workoutTaskId: string;
}

export const deleteSetsByTask = async ({
  sessionId,
  workoutTaskId,
}: DeleteSetsBySessionExercise): Promise<string> => {
  const query = `DELETE FROM sets 
  WHERE session_id = $1 AND exercise_id IN (SELECT exercise_id FROM workout_task_exercises WHERE workout_task_id = $2)`;
  const data = await db.query(query, [sessionId, workoutTaskId]);
  return data.rows[0];
};

interface QueryParams {
  sessionId: string;
}

export const queryTaskToContinueFrom = async ({ sessionId }: QueryParams) => {
  const query = `
    SELECT
        sets.updated_at,
        e.exercise_id,
        sets.session_id,
        wte.workout_task_id
      FROM sets
      JOIN exercises e
          on sets.exercise_id = e.exercise_id
      JOIN workout_task_exercises wte
          on e.exercise_id = wte.exercise_id
      WHERE session_id = $1
      ORDER BY sets.updated_at DESC LIMIT 1;
    `;

  const params = [sessionId];
  const data = await db.query<
    Pick<sets_table, 'updated_at' | 'session_id'> &
      Pick<exercises_table, 'exercise_id'> &
      Pick<workout_task_exercises_table, 'workout_task_id'>
  >(query, params);
  if (!data.rowCount) throw new Error('No exercise to continue from');
  return data.rows[0];
};

export const queryWorkoutExerciseRecord = async (
  workoutId: string,
  exerciseId: string,
  accountId: string
) => {
  const query = `SELECT
    sets.weight,
    sets.repetitions,
    sets.set_id,
    sets.session_id,
    sets.created_at
    FROM sets
    JOIN (
        SELECT
            sets.session_id,
            sets.weight
        FROM sets
        ORDER BY weight DESC
        LIMIT 1
    ) x
        on sets.session_id = x.session_id
    JOIN sessions s on sets.session_id = s.session_id
        WHERE s.workout_id = $1
          AND exercise_id = $2
          AND created_by = $3
    ORDER BY sets.created_at ASC`;

  const data = await db.query(query, [workoutId, exerciseId, accountId]);
  return data.rows;
};

interface CreateSet {
  sessionId: string;
  exerciseId: string;
  weight: number | undefined;
  repetitions: number | undefined;
}

export const createSet = async ({
  sessionId,
  exerciseId,
  weight,
  repetitions,
}: CreateSet) => {
  const query = `
  WITH 
    data(exercise_id, repetitions, weight, session_id) AS (
      VALUES                           
          (${exerciseId}, ${repetitions ?? 0}, ${weight ?? 0}, ${sessionId})
      )
    INSERT INTO sets (exercise_id, repetitions, weight, session_id)
      SELECT exercise_id, repetitions, weight, session_id
        FROM data
      RETURNING *
  `;

  const data = await db.query(query);
  return data.rows[0];
};

export const deleteSet = async (setId: string) => {
  const query = `DELETE FROM sets WHERE set_id = $1 RETURNING *;`;
  const params = [setId];
  const data = await db.query(query, params);
  return data;
};

export const deleteSetsByExercise = async (
  sessionId: string,
  exerciseId: string
) => {
  const query = `DELETE FROM sets WHERE session_id = $1 AND exercise_id = $2 RETURNING *;`;
  const params = [sessionId, exerciseId];
  const data = await db.query(query, params);
  return data;
};
