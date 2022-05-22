import { Response } from 'express';
import {
  doesWorkoutHaveSessions,
  updateSessionWorkout,
} from 'queries/sessions';
import { deleteSetsByTask } from 'queries/sets';
import {
  cloneWorkoutTasksWithExercises,
  deleteWorkoutTask,
} from 'queries/workoutTasks';
import {
  cloneWorkout,
  retrieveWorkoutQuery,
  updateWorkoutTaskOrder,
} from 'queries/workouts';

/**
 * Removes a task from a session.
 *
 * Removes:
 * 1. The ```workout_tasks``` row
 * 2. The ```workout_task_exercises rows``` associated with the task
 * 2. The ```sets``` associated with the ```workout_task_exercises```.
 */
export const removeTask = async (
  res: Response,
  sessionId: string,
  workoutTaskId: string,
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

      const data = await onTaskDeleteClone({
        workoutId,
        accountId,
        workoutTaskId,
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
    const changedExerciseId = await onTaskDelete({
      workoutId,
      accountId,
      sessionId,
      workoutTaskId,
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
  workoutTaskId: string;
  sessionId: string;
}

const onTaskDeleteClone = async ({
  workoutId,
  accountId,
  workoutTaskId,
  sessionId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new Error('Workout not found');

  const { newWorkoutId } = await cloneWorkout({
    accountId,
    workoutId,
  });

  const mappedTasks = oldWorkout.task_order
    .map((taskId) => {
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
    })
    // remove the deleted task from the array
    .filter((task) => task.workout_task_id !== workoutTaskId);

  await cloneWorkoutTasksWithExercises({
    newWorkoutId,
    payload: [...mappedTasks],
  });

  await updateSessionWorkout({
    sessionId,
    workoutId: newWorkoutId,
  });

  const newtaskOrder = JSON.stringify(
    [...(oldWorkout.task_order ? oldWorkout.task_order : [])].filter(
      (id) => id !== workoutTaskId
    )
  );

  await updateWorkoutTaskOrder({
    taskOrder: newtaskOrder,
    workoutId,
  });

  return workoutTaskId;
};

const onTaskDelete = async ({
  workoutId,
  accountId,
  workoutTaskId,
  sessionId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new Error('Workout not found');

  // get task by id
  const task = oldWorkout.tasks.find(
    (task) => task.workout_task_id === workoutTaskId
  );

  if (!task) throw new Error('Task not found');

  const taskOrder = JSON.stringify([
    ...oldWorkout.task_order.filter((id: string) => id !== workoutTaskId),
  ]);

  await updateWorkoutTaskOrder({
    taskOrder,
    workoutId,
  });

  const changedExerciseId = await deleteWorkoutTask(task.workout_task_id);

  await deleteSetsByTask({
    sessionId,
    workoutTaskId,
  });

  return changedExerciseId;
};
