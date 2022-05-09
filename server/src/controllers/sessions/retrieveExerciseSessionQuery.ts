import { db } from 'config/db';
import { Response } from 'express';

export const retrieveExerciseSessionQuery = async (
  res: Response,
  sessionId: string,
  exerciseId: string
) => {
  try {
    const mainExercise = await queryMainExercise(sessionId, exerciseId);
    if (!mainExercise) {
      res.status(404).json({
        status: 'error',
        message: 'Exercise not found',
      });
    }
    const sessionSetRecord = await queryWorkoutExerciseRecord(
      mainExercise.workout_id,
      exerciseId,
      res.locals.state.account.account_id
    );

    const exerciseOrder = mainExercise.exercise_order;

    // get index in array for current exercise
    const currentExerciseIndex = exerciseOrder.findIndex(
      (id: string) => id === exerciseId
    );

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Exercise fetched successfully',
      status: 'success',
      exercise: mainExercise,
      record: sessionSetRecord,
      next: {
        order: {
          exercise_id: exerciseOrder[currentExerciseIndex + 1],
        },
      },
      prev: {
        order: {
          exercise_id: exerciseOrder[currentExerciseIndex - 1],
        },
      },
    });
  } catch (error) {
    console.log({ error });
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
      exercises.name,
      exercises.description,
      exercises.category,
      workouts.exercise_order,
      video,
      profile,
      exercises.view,
      sessions.workout_id,
      "order",
      notes
  FROM exercises
  JOIN workout_exercises
     ON exercises.exercise_id = workout_exercises.exercise_id
  JOIN sessions 
    ON sessions.workout_id = workout_exercises.workout_id
  JOIN workouts 
    ON workouts.workout_id = sessions.workout_id
  WHERE
    sessions.session_id = ${sessionId}
   AND exercises.exercise_id = ${exerciseId}
  `;

  const data = await db.query(query);
  return data.rows[0];
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
