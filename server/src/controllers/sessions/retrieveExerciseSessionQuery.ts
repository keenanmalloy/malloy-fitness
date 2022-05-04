import { db } from 'config/db';
import { Response } from 'express';

export const retrieveExerciseSessionQuery = async (
  res: Response,
  sessionId: string,
  exerciseId: string
) => {
  try {
    const mainExercise = await queryMainExercise(sessionId, exerciseId);
    const sessionSetRecord = await queryWorkoutExerciseRecord(
      mainExercise.workout_id,
      exerciseId,
      res.locals.state.account.account_id
    );
    const nextOrderEx = await queryExerciseByNextOrder(
      sessionId,
      mainExercise.order
    );

    const prevOrderEx = await queryExerciseByPrevOrder(
      sessionId,
      mainExercise.order
    );

    const nextExerciseByOrder =
      nextOrderEx.filter(
        (ex) => ex.exercise_id !== exerciseId && mainExercise.order < ex.order
      )[0] ?? null;

    const prevExerciseByOrder =
      prevOrderEx.filter(
        (ex) => ex.exercise_id !== exerciseId && mainExercise.order > ex.order
      )[0] ?? null;

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Exercise fetched successfully',
      status: 'success',
      exercise: mainExercise,
      record: sessionSetRecord,
      next: {
        order: nextExerciseByOrder,
      },
      prev: {
        order: prevExerciseByOrder,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      exercises: null,
    });
  }
};

const queryMainExercise = async (sessionId: string, exerciseId: string) => {
  const query = `SELECT
    exercises.exercise_id,
    name,
    description,
    category,
    video,
    profile,
    view,
    sessions.workout_id,
    priority,
    "order",
    notes
  FROM exercises
  JOIN workout_exercises
     ON exercises.exercise_id = workout_exercises.exercise_id
  JOIN sessions 
    ON sessions.workout_id = workout_exercises.workout_id
  WHERE
       session_id = ${sessionId}
   AND exercises.exercise_id = ${exerciseId}
  `;

  const data = await db.query(query);
  return data.rows[0];
};

const queryExerciseByNextOrder = async (sessionId: string, order: number) => {
  let query = `
        SELECT
            exercises.exercise_id,
            priority,
            "order"
        FROM exercises
        JOIN workout_exercises
            ON exercises.exercise_id = workout_exercises.exercise_id
        JOIN sessions 
            ON sessions.workout_id = workout_exercises.workout_id
        WHERE
            session_id = ${sessionId}
        AND workout_exercises.order > ${order}
        ORDER BY 
          workout_exercises.order ASC, workout_exercises.priority ASC
        LIMIT 1
    `;

  const data = await db.query(query);
  return data.rows;
};

const queryExerciseByPrevOrder = async (sessionId: string, order: number) => {
  let query = `
        SELECT
            exercises.exercise_id,
            priority,
            "order"
        FROM exercises
        JOIN workout_exercises
            ON exercises.exercise_id = workout_exercises.exercise_id
        JOIN sessions 
            ON sessions.workout_id = workout_exercises.workout_id
        WHERE
            session_id = ${sessionId}
        AND workout_exercises.order < ${order}
          ORDER BY workout_exercises.order DESC, workout_exercises.priority ASC
        LIMIT 1
    `;

  const data = await db.query(query);
  return data.rows;
};

const queryWorkoutExerciseRecord = async (
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
