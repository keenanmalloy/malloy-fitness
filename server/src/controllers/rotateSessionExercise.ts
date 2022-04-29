import { db } from 'config/db';
import { Response } from 'express';
import { cloneWorkout } from 'queries/cloneWorkout';
import { doesWorkoutHaveSessions } from 'queries/doesWorkoutHaveSessions';
import { getExerciseWithMuscleGroups } from 'queries/getExerciseWithMuscleGroups';
import { getRelatedExercises } from 'queries/getRelatedExercises';
import { updateSessionWorkout } from 'queries/updateSessionWorkout';

export const rotateSessionExercise = async (
  res: Response,
  sessionId: string,
  exerciseId: string,
  body: {
    workoutId: string;
  }
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const workoutId = body.workoutId;

  const hasSessions = await doesWorkoutHaveSessions(workoutId);
  if (hasSessions) {
    const data = await onRelatedExerciseChangeClone({
      workoutId,
      accountId,
      exerciseId,
      sessionId,
    });

    return res.status(201).json({
      role: res.locals.state.account.role,
      message: 'Successfully cloned workout',
      status: 'success',
      workout: data,
    });
  }

  return res.status(201).json({
    role: res.locals.state.account.role,
    message: 'Successfully cloned workout.',
    status: 'success',
    workout: '',
  });
};

interface CloneMutationParams {
  workoutId: string;
  accountId: string;
  exerciseId: string;
  sessionId: string;
}

const onRelatedExerciseChangeClone = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseId,
}: CloneMutationParams) => {
  const { newWorkoutId, oldWorkout } = await cloneWorkout({
    accountId,
    workoutId,
  });

  const exerciseData = await getExerciseWithMuscleGroups({
    exerciseId,
    accountId,
  });

  const relatedExercises = await getRelatedExercises({
    accountId: accountId,
    categoryQuery: exerciseData.category,
    exerciseIdQuery: exerciseData.exercise_id,
    mgIds: [
      ...exerciseData.primary.map(
        (mg: { muscle_group_id: any }) => mg.muscle_group_id
      ),
      ...exerciseData.secondary.map(
        (mg: { muscle_group_id: any }) => mg.muscle_group_id
      ),
    ],
    profileQuery: exerciseData.profile,
    type: exerciseData.type,
  });

  const rowLength = relatedExercises.rows.length;
  const randomRelatedExercise =
    relatedExercises.rows[Math.floor(Math.random() * rowLength)];

  const newWorkoutExercises = [
    ...oldWorkout.workoutExercises.filter((we) => we.exerciseId !== exerciseId),
    randomRelatedExercise,
  ];

  const generateWeValues = () => {
    return newWorkoutExercises
      .map(
        (we) =>
          `(${newWorkoutId}, 
                ${we.exerciseId}, 
                ${we.priority}, 
                ${we.order}, 
                ${we.notes ?? null}, 
                ${we.sets ?? null}, 
                ${we.repetitions ?? null}, 
                ${we.reps_in_reserve ?? null}, 
                ${we.rest_period ?? null})`
      )
      .join(',');
  };

  if (!oldWorkout.workoutExercises.length) {
    return newWorkoutId;
  }

  const weQuery = `
          WITH
            wedata(workout_id, exercise_id, priority, "order", notes, sets, repetitions, reps_in_reserve, rest_period) AS (
                VALUES 
                  ${generateWeValues()}
              )
            INSERT INTO workout_exercises (workout_id, exercise_id, priority, "order", notes, sets, repetitions, reps_in_reserve, rest_period)
              SELECT workout_id, exercise_id, priority, "order", notes, sets, repetitions, reps_in_reserve, rest_period
                FROM wedata
              RETURNING *
        `;

  await db.query(weQuery);
  await updateSessionWorkout({
    sessionId,
    workoutId: newWorkoutId,
  });

  return newWorkoutId;
};
