import { db } from 'config/db';
import { Response } from 'express';
import { cloneWorkout } from 'queries/cloneWorkout';
import { doesWorkoutHaveSessions } from 'queries/doesWorkoutHaveSessions';
import { getExerciseWithMuscleGroups } from 'queries/getExerciseWithMuscleGroups';
import { getRelatedExercises } from 'queries/getRelatedExercises';
import { retrieveWorkoutQuery } from 'queries/retrieveWorkoutQuery';
import { updateSessionWorkout } from 'queries/updateSessionWorkout';
import { updateWorkoutExercise } from 'queries/updateWorkoutExercise';
import { updateWorkoutExerciseOrder } from 'queries/updateWorkoutExerciseOrder';

export const rotateSessionExercise = async (
  res: Response,
  sessionId: string,
  exerciseId: string,
  body: {
    workout_id: string;
  }
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const workoutId = body.workout_id;

  try {
    const { hasSessions, sessionCount } = await doesWorkoutHaveSessions(
      workoutId
    );

    if (hasSessions && sessionCount > 1) {
      console.warn('WORKOUT ALREADY HAS SESSIONS - NEED TO CLONE', {
        need_to_clone: sessionCount > 1,
      });

      const data = await onRelatedExerciseChangeClone({
        workoutId,
        accountId,
        exerciseId,
        sessionId,
      });

      return res.status(201).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout and changed exercise in session.',
        status: 'success',
        exerciseId: data,
      });
    }

    console.warn('REPLACING EXERCISE IN SESSION');
    const newExerciseId = await onRelatedExerciseChangeSwap({
      workoutId,
      accountId,
      exerciseId,
      sessionId,
    });

    return res.status(201).json({
      role: res.locals.state.account.role,
      message: 'Successfully changed exercise in session.',
      status: 'success',
      exerciseId: newExerciseId,
    });
  } catch (error) {
    const errorMessage = (error as unknown as { message: string })?.message;
    return res.status(500).json({
      error: 'Something went wrong',
      message: errorMessage,
    });
  }
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
  const oldWorkout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!oldWorkout) throw new Error('Workout not found');

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

  const oldExerciseIds = oldWorkout.workoutExercises.map((we) => we.exerciseId);

  // Filter out exercises that are already in the workout so we don't add duplicates
  const filteredRelatedExercises = relatedExercises.rows.filter(
    (re) => !oldExerciseIds.includes(re.exercise_id)
  );

  const rowLength = filteredRelatedExercises.length;
  if (!rowLength) throw new Error('No related exercises found');

  const randomRelatedExercise =
    filteredRelatedExercises[Math.floor(Math.random() * rowLength)];

  // get workout exercise with id
  const workoutExercise = oldWorkout.workoutExercises.find(
    (we) => we.exerciseId === exerciseId
  );
  if (!workoutExercise) throw new Error('WorkoutExercise not found');
  const formattedRandomRelatedExercise = {
    ...randomRelatedExercise,
    exerciseId: randomRelatedExercise.exercise_id,
    repetitions: workoutExercise.repetitions,
    reps_in_reserve: workoutExercise.reps_in_reserve,
    rest_period: workoutExercise.rest_period,
  };

  const newWorkoutExercises = [
    ...oldWorkout.workoutExercises.filter((we) => we.exerciseId !== exerciseId),
    formattedRandomRelatedExercise,
  ];

  const { newWorkoutId } = await cloneWorkout({
    accountId,
    workoutId,
  });

  const generateWeValues = () => {
    return newWorkoutExercises
      .map(
        (we) =>
          `(${newWorkoutId}, 
                ${we.exerciseId}, 
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
  await updateSessionWorkout({
    sessionId,
    workoutId: newWorkoutId,
  });

  return randomRelatedExercise.exercise_id;
};

const onRelatedExerciseChangeSwap = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!oldWorkout) throw new Error('Workout not found');

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

  const oldExerciseIds = oldWorkout.workoutExercises.map((we) => we.exerciseId);

  // Filter out exercises that are already in the workout so we don't add duplicates
  const filteredRelatedExercises = relatedExercises.rows.filter(
    (re) => !oldExerciseIds.includes(re.exercise_id)
  );

  const rowLength = filteredRelatedExercises.length;
  if (!rowLength) throw new Error('No related exercises found');

  const randomRelatedExercise =
    filteredRelatedExercises[Math.floor(Math.random() * rowLength)];

  if (!oldWorkout) throw new Error('Workout not found');

  // get workout exercise with id
  const workoutExercise = oldWorkout.workoutExercises.find(
    (we) => we.exerciseId === exerciseId
  );
  if (!workoutExercise) throw new Error('WorkoutExercise not found');

  const newExerciseId = await updateWorkoutExercise({
    exerciseId: randomRelatedExercise.exercise_id,
    workoutExerciseId: workoutExercise.workout_exercise_id,
  });

  const exerciseOrder = JSON.stringify(
    [
      ...oldWorkout.workoutExercises.filter((e) => e.exerciseId !== exerciseId),
      { exerciseId: newExerciseId },
    ].map((e) => {
      return e.exerciseId;
    })
  );

  await updateWorkoutExerciseOrder({
    exerciseOrder,
    workoutId,
  });

  return newExerciseId;
};
