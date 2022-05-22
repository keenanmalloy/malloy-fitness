import { Response } from 'express';
import {
  doesWorkoutHaveSessions,
  updateSessionWorkout,
} from 'queries/sessions';
import { updateTaskExercise } from 'queries/workoutTaskExercises';
import {
  cloneWorkoutTasksWithExercises,
  createWorkoutTaskWithExercises,
} from 'queries/workoutTasks';
import {
  cloneWorkout,
  retrieveWorkoutQuery,
  updateWorkoutTaskOrder,
} from 'queries/workouts';

/**
 * Changes the ```workout_task_exercise```.
 * If the workout has more than one session,
 * it will clone the workout and update the session with the changed exercise.
 */
export const changeTaskExercise = async (
  res: Response,
  sessionId: string,
  currentExerciseId: string, // the current exercise_id
  body: {
    workoutId: string;
    workoutTaskId: string;
    currentWorkoutTaskExerciseId: string; // the current workout_task_exercise_id
    newExerciseId: string; // the new exercise_id
  }
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const workoutId = body.workoutId;
  const newExerciseId = body.newExerciseId;
  const workoutTaskId = body.workoutTaskId;
  const currentWorkoutTaskExerciseId = body.currentWorkoutTaskExerciseId;

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
        accountId,
        workoutId,
        currentExerciseId,
        currentWorkoutTaskExerciseId,
        workoutTaskId,
        newExerciseId,
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
      accountId,
      workoutId,
      currentExerciseId,
      currentWorkoutTaskExerciseId,
      workoutTaskId,
      newExerciseId,
      sessionId,
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

  /**
   * The account_id of the user to pass to the ```created_by``` field
   */
  accountId: string;
  currentExerciseId: string;
  currentWorkoutTaskExerciseId: string;
  newExerciseId: string;
  sessionId: string;
  workoutTaskId: string;
}

const onExerciseChangeClone = async ({
  accountId,
  workoutId,
  currentExerciseId,
  currentWorkoutTaskExerciseId,
  workoutTaskId,
  newExerciseId,
  sessionId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new Error('Workout not found');

  // get task exercise with id
  const taskExercise = oldWorkout.tasks.find(
    (task) => task.workout_task_exercise_id === currentWorkoutTaskExerciseId
  );
  if (!taskExercise) throw new Error('Exercise not found');

  const { newWorkoutId } = await cloneWorkout({
    accountId,
    workoutId,
  });

  const mappedTasks = oldWorkout.task_order.map((taskId) => {
    const exercises = oldWorkout.tasks.filter(
      (t) => t.workout_task_id === taskId
    );
    return {
      workout_task_id: taskId,
      exercises: exercises.map((t) => {
        return {
          exercise_id: t.exercise_id,
          sets: t.sets,
          repetitions: t.repetitions,
          reps_in_reserve: t.reps_in_reserve,
          rest_period: t.rest_period,
        };
      }),
    };
  });

  await cloneWorkoutTasksWithExercises({
    newWorkoutId,
    payload: [...mappedTasks],
  });

  const newWorkoutTaskId = await createWorkoutTaskWithExercises({
    workoutId: newWorkoutId,
    payload: {
      exercise_id: newExerciseId,
    },
  });

  await updateSessionWorkout({
    sessionId,
    workoutId: newWorkoutId,
  });

  const newtaskOrder = JSON.stringify(
    (oldWorkout.task_order ? oldWorkout.task_order : []).map((id: string) => {
      return id === workoutTaskId ? newWorkoutTaskId : id;
    })
  );

  await updateWorkoutTaskOrder({
    taskOrder: newtaskOrder,
    workoutId,
  });

  return newExerciseId;
};

const onExerciseChangeSwap = async ({
  accountId,
  workoutId,
  currentExerciseId,
  currentWorkoutTaskExerciseId,
  workoutTaskId,
  newExerciseId,
  sessionId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new Error('Workout not found');

  // get workout exercise with id
  const currentTaskExercise = oldWorkout.tasks.find(
    (task) => task.workout_task_exercise_id === currentWorkoutTaskExerciseId
  );
  if (!currentTaskExercise || !currentTaskExercise.workout_task_exercise_id)
    throw new Error('Exercise not found');

  await updateTaskExercise({
    exercise_id: newExerciseId,
    workout_task_exercise_id: currentTaskExercise.workout_task_exercise_id,
  });
};
