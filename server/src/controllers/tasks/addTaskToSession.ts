import { Response } from 'express';
import {
  doesWorkoutHaveSessions,
  updateSessionWorkout,
} from 'queries/sessions';

import {
  cloneWorkout,
  retrieveWorkoutQuery,
  updateWorkoutTaskOrder,
} from 'queries/workouts';
import {
  cloneWorkoutTasksWithExercises,
  createWorkoutTaskWithExercises,
} from 'queries/workoutTasks';

class WorkoutNotFoundError extends Error {}
class TaskOrderNullError extends Error {}

export const addTaskToSession = async (
  res: Response,
  sessionId: string,
  body: {
    workoutId: string;
    exercises: string[];
  }
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const workoutId = body.workoutId;

  // check if body.exercises is an array
  if (!Array.isArray(body.exercises)) {
    return res.status(422).json({
      error: 'Exercises must be an array',
    });
  }

  try {
    // first, check if the workout has previous sessions connected
    // if not, update the workout_exercise
    // otherwise, clone the workout and update the session
    const { hasSessions, sessionCount } = await doesWorkoutHaveSessions(
      workoutId
    );

    if (hasSessions && sessionCount > 1) {
      const newWorkoutId = await onTaskChangeClone({
        workoutId,
        accountId,
        exerciseIds: body.exercises,
        sessionId,
      });

      return res.status(201).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout and added task.',
        status: 'success',
        newWorkoutId,
      });
    }

    const addedTaskId = await onTaskAdd({
      workoutId,
      accountId,
      sessionId,
      exerciseIds: body.exercises,
    });

    return res.status(201).json({
      role: res.locals.state.account.role,
      message: 'Successfully added task.',
      status: 'success',
      taskId: addedTaskId,
    });
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        message: 'Workout not found.',
        status: 'error',
      });
    }

    if (error instanceof TaskOrderNullError) {
      return res.status(400).json({
        role: res.locals.state.account.role,
        message: 'Workout has no exercises',
        status: 'error',
      });
    }

    console.error({ error });
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
  exerciseIds: string[];
  sessionId: string;
}

const onTaskChangeClone = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseIds,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new WorkoutNotFoundError('Workout not found');
  if (!oldWorkout.task_order)
    throw new TaskOrderNullError(
      `Task order is null for workout_id: ${oldWorkout.workout_id}`
    );

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

  const newWorkoutTasks = await cloneWorkoutTasksWithExercises({
    newWorkoutId,
    payload: [...mappedTasks],
  });

  const addedWorkoutTaskId = await createWorkoutTaskWithExercises({
    workoutId: newWorkoutId,
    payload: exerciseIds.map((id) => {
      return {
        exercise_id: id,
      };
    }),
  });

  const newTaskOrder = JSON.stringify([
    ...new Set(newWorkoutTasks.map((task) => task.workout_task_id)),
    addedWorkoutTaskId,
  ]);

  await updateWorkoutTaskOrder({
    workoutId: newWorkoutId,
    taskOrder: newTaskOrder,
  });

  await updateSessionWorkout({
    sessionId,
    workoutId: newWorkoutId,
  });

  return newWorkoutId;
};

const onTaskAdd = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseIds,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new WorkoutNotFoundError('Workout not found');

  const addedTaskId = await createWorkoutTaskWithExercises({
    payload: exerciseIds.map((exerciseId) => {
      return {
        exercise_id: exerciseId,
      };
    }),
    workoutId,
  });

  const taskOrder = JSON.stringify([
    ...(oldWorkout.task_order ? oldWorkout.task_order : []),
    addedTaskId,
  ]);

  await updateWorkoutTaskOrder({
    taskOrder,
    workoutId,
  });

  return addedTaskId;
};
