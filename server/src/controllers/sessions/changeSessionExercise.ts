import { db } from 'config/db';
import { Response } from 'express';
import { cloneWorkout } from 'queries/cloneWorkout';
import { cloneWorkoutExercises } from 'queries/cloneWorkoutExercises';
import { doesWorkoutHaveSessions } from 'queries/doesWorkoutHaveSessions';
import { retrieveWorkoutQuery } from 'queries/retrieveWorkoutQuery';
import { updateSessionWorkout } from 'queries/updateSessionWorkout';
import { updateWorkoutExercise } from 'queries/updateWorkoutExercise';
import { updateWorkoutExerciseOrder } from 'queries/updateWorkoutExerciseOrder';

export const changeSessionExercise = async (
  res: Response,
  sessionId: string,
  exerciseId: string,
  body: {
    workout_id: string;
    new_exercise_id: string;
  }
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const workoutId = body.workout_id;
  const newExerciseId = body.new_exercise_id;

  try {
    // first, check if the workout has previous sessions connected
    // if not, update the workout_exercise
    // otherwise, clone the workout and update the session
    const { hasSessions, sessionCount } = await doesWorkoutHaveSessions(
      workoutId
    );

    if (hasSessions && sessionCount > 1) {
      console.warn('WORKOUT ALREADY HAS SESSIONS - NEED TO CLONE', {
        need_to_clone: sessionCount > 1,
      });

      const data = await onExerciseChangeClone({
        workoutId,
        accountId,
        oldExerciseId: exerciseId,
        newExerciseId: newExerciseId,
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
    const changedExerciseId = await onExerciseChangeSwap({
      workoutId,
      accountId,
      sessionId,
      oldExerciseId: exerciseId,
      newExerciseId: newExerciseId,
    });

    return res.status(201).json({
      role: res.locals.state.account.role,
      message: 'Successfully changed exercise in session.',
      status: 'success',
      exerciseId: changedExerciseId,
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
  oldExerciseId: string;
  newExerciseId: string;
  sessionId: string;
}

const onExerciseChangeClone = async ({
  workoutId,
  accountId,
  sessionId,
  oldExerciseId,
  newExerciseId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!oldWorkout) throw new Error('Workout not found');

  // get workout exercise with id
  const workoutExercise = oldWorkout.workoutExercises.find(
    (we) => we.exerciseId === oldExerciseId
  );
  if (!workoutExercise) throw new Error('WorkoutExercise not found');

  const formattedNewExercise = {
    ...workoutExercise,
    exerciseId: newExerciseId,
  };

  const newWorkoutExercises = [
    ...oldWorkout.workoutExercises.filter(
      (we) => we.exerciseId !== oldExerciseId
    ),
    formattedNewExercise,
  ];

  const { newWorkoutId } = await cloneWorkout({
    accountId,
    workoutId,
  });

  const exerciseOrder = JSON.stringify(
    [
      ...oldWorkout.workoutExercises.filter(
        (e) => e.exerciseId !== oldExerciseId
      ),
      { exerciseId: newExerciseId },
    ].map((e) => {
      return e.exerciseId;
    })
  );

  await updateWorkoutExerciseOrder({
    exerciseOrder,
    workoutId,
  });

  await cloneWorkoutExercises({
    workoutId: newWorkoutId,
    workoutExercises: newWorkoutExercises,
  });

  await updateSessionWorkout({
    sessionId,
    workoutId: newWorkoutId,
  });

  return newExerciseId;
};

const onExerciseChangeSwap = async ({
  workoutId,
  accountId,
  sessionId,
  newExerciseId,
  oldExerciseId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!oldWorkout) throw new Error('Workout not found');

  // get workout exercise with id
  const workoutExercise = oldWorkout.workoutExercises.find(
    (we) => we.exerciseId === oldExerciseId
  );
  if (!workoutExercise) throw new Error('WorkoutExercise not found');

  const newExerciseOrder = JSON.stringify(
    oldWorkout.exercise_order.map((id: string) => {
      return id === oldExerciseId ? newExerciseId : id;
    })
  );

  await updateWorkoutExerciseOrder({
    exerciseOrder: newExerciseOrder,
    workoutId,
  });

  const changedExerciseId = await updateWorkoutExercise({
    exerciseId: newExerciseId,
    workoutExerciseId: workoutExercise.workout_exercise_id,
  });

  return changedExerciseId;
};
