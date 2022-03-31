import { db } from 'config/db';
import { Response } from 'express';

export const retrieveExerciseWorkoutQuery = async (
  res: Response,
  workoutId: string,
  exerciseId: string
) => {
  try {
    const mainExercise = await queryMainExercise(workoutId, exerciseId);
    const orderedExercise = await queryExerciseByOrder(
      workoutId,
      mainExercise.order
    );

    const prioritizedExercise = await queryExerciseByPriority(
      workoutId,
      mainExercise.order
    );

    const nextExerciseByOrder =
      orderedExercise.filter(
        (ex) => ex.exercise_id !== exerciseId && mainExercise.order < ex.order
      )[0] ?? null;

    const nextExerciseByPriority =
      prioritizedExercise.filter(
        (ex) =>
          ex.exercise_id !== exerciseId && mainExercise.priority < ex.priority
      )[0] ?? null;

    const prevExerciseByOrder =
      orderedExercise.filter(
        (ex) => ex.exercise_id !== exerciseId && mainExercise.order > ex.order
      )[0] ?? null;

    const prevExerciseByPriority =
      prioritizedExercise.filter(
        (ex) =>
          ex.exercise_id !== exerciseId && mainExercise.priority > ex.priority
      )[0] ?? null;

    return res.status(200).json({
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

const queryMainExercise = async (workoutId: string, exerciseId: string) => {
  const query = `SELECT
    exercises.exercise_id,
    name,
    description,
    category,
    video,
    profile,
    view,
    workout_id,
    priority,
    "order"
  FROM exercises
  JOIN workout_exercises
     ON exercises.exercise_id = workout_exercises.exercise_id
  WHERE
       workout_id = ${workoutId}
   AND exercises.exercise_id = ${exerciseId}
  `;

  const data = await db.query(query);
  return data.rows[0];
};

const queryExerciseByOrder = async (workoutId: string, order: number) => {
  let query;
  // if the order is 1, only fetch the next exercise
  if (!order) {
    query = `
        SELECT
            exercises.exercise_id,
            priority,
            "order"
        FROM exercises
        JOIN workout_exercises
            ON exercises.exercise_id = workout_exercises.exercise_id
        WHERE
            workout_id = ${workoutId}
        AND workout_exercises.order IN(1, 2)
   `;
  } else {
    query = `
        SELECT
            exercises.exercise_id,
            priority,
            "order"
        FROM exercises
        JOIN workout_exercises
            ON exercises.exercise_id = workout_exercises.exercise_id
        WHERE
            workout_id = ${workoutId}
        AND workout_exercises.order IN(${order - 1}, ${order}, ${order + 1})
    `;
  }

  const data = await db.query(query);
  return data.rows;
};

const queryExerciseByPriority = async (workoutId: string, order: number) => {
  let query = `
          SELECT
              exercises.exercise_id,
              priority,
              "order"
          FROM exercises
          JOIN workout_exercises
              ON exercises.exercise_id = workout_exercises.exercise_id
          WHERE
              workout_id = ${workoutId}
          AND workout_exercises."order" = ${order}
      `;

  const data = await db.query(query);
  return data.rows;
};
