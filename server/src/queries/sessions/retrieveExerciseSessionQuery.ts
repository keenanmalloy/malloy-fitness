import { db } from 'config/db';
import { Response } from 'express';

export const retrieveExerciseSessionQuery = async (
  res: Response,
  sessionId: string,
  exerciseId: string
) => {
  try {
    const mainExercise = await queryMainExercise(sessionId, exerciseId);
    const nextOrderEx = await queryExerciseByNextOrder(
      sessionId,
      mainExercise.order
    );

    const prevOrderEx = await queryExerciseByPrevOrder(
      sessionId,
      mainExercise.order
    );

    const prioritizedExercise = await queryExerciseByPriority(
      sessionId,
      mainExercise.order
    );

    const nextExerciseByOrder =
      nextOrderEx.filter(
        (ex) => ex.exercise_id !== exerciseId && mainExercise.order < ex.order
      )[0] ?? null;

    const nextExerciseByPriority =
      prioritizedExercise.filter(
        (ex) =>
          ex.exercise_id !== exerciseId && mainExercise.priority < ex.priority
      )[0] ?? null;

    const prevExerciseByOrder =
      prevOrderEx.filter(
        (ex) => ex.exercise_id !== exerciseId && mainExercise.order > ex.order
      )[0] ?? null;

    const prevExerciseByPriority =
      prioritizedExercise.filter(
        (ex) =>
          ex.exercise_id !== exerciseId && mainExercise.priority > ex.priority
      )[0] ?? null;

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Exercise fetched successfully',
      status: 'success',
      exercise: mainExercise,
      next: {
        order: nextExerciseByOrder,
        priority: nextExerciseByPriority,
      },
      prev: {
        order: prevExerciseByOrder,
        priority: prevExerciseByPriority,
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

const queryExerciseByPriority = async (sessionId: string, order: number) => {
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
          AND workout_exercises."order" = ${order}
      `;

  const data = await db.query(query);
  return data.rows;
};
