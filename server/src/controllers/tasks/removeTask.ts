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

class WorkoutNotFoundError extends Error {}
class TaskOrderNullError extends Error {}

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

  // if missing query param return 400
  if (!workoutId) {
    return res.status(400).json({
      error: 'Missing query param: workoutId',
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
      const newWorkoutId = await onTaskDeleteClone({
        workoutId,
        accountId,
        workoutTaskId,
        sessionId,
      });

      return res.status(200).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout and removed exercise.',
        status: 'success',
        newWorkoutId,
      });
    }

    const deletedTaskId = await onTaskDelete({
      workoutId,
      accountId,
      sessionId,
      workoutTaskId,
    });

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Successfully removed task from session.',
      status: 'success',
      taskId: deletedTaskId,
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
  if (!oldWorkout) throw new WorkoutNotFoundError('Workout not found');
  if (!oldWorkout.task_order)
    throw new TaskOrderNullError(
      `Task order is null for workout_id: ${oldWorkout.workout_id}`
    );

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

  const newWorkoutTasks = await cloneWorkoutTasksWithExercises({
    newWorkoutId,
    payload: [...mappedTasks],
  });

  const newTaskOrder = JSON.stringify([
    ...new Set(newWorkoutTasks.map((task) => task.workout_task_id)),
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

const onTaskDelete = async ({
  workoutId,
  accountId,
  workoutTaskId,
  sessionId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new WorkoutNotFoundError('Workout not found');

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

  const deletedTaskId = await deleteWorkoutTask(task.workout_task_id);

  await deleteSetsByTask({
    sessionId,
    workoutTaskId,
  });

  return deletedTaskId;
};
