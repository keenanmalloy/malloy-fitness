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

      const data = await onTaskChangeClone({
        workoutId,
        accountId,
        exerciseIds: body.exercises,
        sessionId,
      });

      return res.status(201).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout and added exercise.',
        status: 'success',
        exerciseId: data,
      });
    }

    console.warn('--ADDING TASK TO SESSION--');
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
  if (!oldWorkout) throw new Error('Workout not found');

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

  await updateWorkoutTaskOrder({
    workoutId: newWorkoutId,
    taskOrder: JSON.stringify([
      ...new Set(newWorkoutTasks.map((task) => task.workout_task_id)),
    ]),
  });

  await createWorkoutTaskWithExercises({
    workoutId: newWorkoutId,
    payload: exerciseIds.map((id) => {
      return {
        exercise_id: id,
      };
    }),
  });

  await updateSessionWorkout({
    sessionId,
    workoutId: newWorkoutId,
  });
};

const onTaskAdd = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseIds,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new Error('Workout not found');

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
