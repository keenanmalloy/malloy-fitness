import { Response } from 'express';
import { cloneWorkout } from 'queries/cloneWorkout';
import { cloneWorkoutExercises } from 'queries/cloneWorkoutExercises';
import { deleteSetsBySessionExercise } from 'queries/deleteSetsbySessionExercise';
import { deleteWorkoutExercise } from 'queries/deleteWorkoutExercise';
import { doesWorkoutHaveSessions } from 'queries/doesWorkoutHaveSessions';
import { retrieveWorkoutQuery } from 'queries/retrieveWorkoutQuery';
import { updateSessionWorkout } from 'queries/updateSessionWorkout';
import { updateWorkoutExerciseOrder } from 'queries/updateWorkoutExerciseOrder';

export const removeExerciseInSession = async (
  res: Response,
  sessionId: string,
  exerciseId: string,
  workoutId: string
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;

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

      const data = await onExerciseDeleteClone({
        workoutId,
        accountId,
        exerciseId,
        sessionId,
      });

      return res.status(200).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout and removed exercise.',
        status: 'success',
        exerciseId: data,
      });
    }

    console.warn('REMOVING EXERCISE FROM SESSION');
    const changedExerciseId = await onExerciseDelete({
      workoutId,
      accountId,
      sessionId,
      exerciseId,
    });

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Successfully removed exercise from session.',
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
  exerciseId: string;
  sessionId: string;
}

const onExerciseDeleteClone = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!oldWorkout) throw new Error('Workout not found');

  const newWorkoutExercises = [
    ...oldWorkout.workoutExercises.filter(
      (exercise) => exercise.exerciseId !== exerciseId
    ),
  ];

  const { newWorkoutId } = await cloneWorkout({
    accountId,
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

  return exerciseId;
};

const onExerciseDelete = async ({
  workoutId,
  accountId,
  exerciseId,
  sessionId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!oldWorkout) throw new Error('Workout not found');

  // get workout exercise with id
  const workoutExercise = oldWorkout.workoutExercises.find(
    (we) => we.exerciseId === exerciseId
  );
  if (!workoutExercise) throw new Error('WorkoutExercise not found');

  const exerciseOrder = JSON.stringify(
    [
      ...oldWorkout.workoutExercises.filter(
        (we) => we.exerciseId !== exerciseId
      ),
    ].map((e) => {
      return e.exerciseId;
    })
  );

  await updateWorkoutExerciseOrder({
    exerciseOrder,
    workoutId,
  });

  const changedExerciseId = await deleteWorkoutExercise({
    workoutExerciseId: workoutExercise.workout_exercise_id,
  });

  await deleteSetsBySessionExercise({
    sessionId,
    exerciseId,
  });

  return changedExerciseId;
};
