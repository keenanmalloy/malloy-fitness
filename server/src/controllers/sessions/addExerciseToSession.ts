import { Response } from 'express';
import { cloneWorkout } from 'queries/cloneWorkout';
import { cloneWorkoutExercises } from 'queries/cloneWorkoutExercises';
import { createWorkoutExercise } from 'queries/createWorkoutExercise';
import { doesWorkoutHaveSessions } from 'queries/doesWorkoutHaveSessions';
import { retrieveWorkoutQuery } from 'queries/retrieveWorkoutQuery';
import { updateSessionWorkout } from 'queries/updateSessionWorkout';

export const addExerciseToSession = async (
  res: Response,
  sessionId: string,
  body: {
    workout_id: string;
    exercise_id: string;
  }
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const workoutId = body.workout_id;
  const exerciseId = body.exercise_id;

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
        exerciseId,
        sessionId,
      });

      return res.status(201).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout and added exercise.',
        status: 'success',
        exerciseId: data,
      });
    }

    console.warn('ADDING EXERCISE TO SESSION');
    const changedExerciseId = await onExerciseAdd({
      workoutId,
      accountId,
      sessionId,
      exerciseId,
    });

    return res.status(201).json({
      role: res.locals.state.account.role,
      message: 'Successfully added exercise in session.',
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

const onExerciseChangeClone = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!oldWorkout) throw new Error('Workout not found');

  const formattedNewExercise = {
    exerciseId,
    order: oldWorkout.workoutExercises.length + 2,
    priority: 1,
    notes: '',
    sets: '',
    repetitions: 0,
    reps_in_reserve: 0,
    rest_period: 0,
  };

  const newWorkoutExercises = [
    ...oldWorkout.workoutExercises,
    formattedNewExercise,
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

const onExerciseAdd = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId, accountId);
  if (!oldWorkout) throw new Error('Workout not found');

  const changedExerciseId = await createWorkoutExercise({
    exerciseId,
    workoutId: oldWorkout.workout_id,
    order: oldWorkout.workoutExercises.length + 2,
  });

  return changedExerciseId;
};
