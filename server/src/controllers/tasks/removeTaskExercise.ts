import { Response } from 'express';
import {
  doesWorkoutHaveSessions,
  updateSessionWorkout,
} from 'queries/sessions';
import { deleteSetsByExercise } from 'queries/sets';
import { cloneWorkoutTasksWithExercises } from 'queries/workoutTasks';
import {
  cloneWorkout,
  retrieveWorkoutQuery,
  updateWorkoutTaskOrder,
} from 'queries/workouts';
import { deleteTaskExerciseById } from 'queries/workoutTaskExercises';
import Joi from 'joi';

class WorkoutNotFoundError extends Error {}
class TaskOrderNullError extends Error {}
class TaskWithNoExercisesError extends Error {}
class ExerciseNotFoundError extends Error {}

const removeTaskExerciseSchema = Joi.object({
  workoutId: Joi.string().max(200).required(),
  workoutTaskExerciseId: Joi.string().max(200).required(),
});

export const removeTaskExercise = async (
  res: Response,
  sessionId: string,
  exerciseId: string,
  workoutId: string,
  workoutTaskExerciseId: string
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;

  const { error, value } = removeTaskExerciseSchema.validate({
    workoutId,
    workoutTaskExerciseId,
  });
  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid body',
      exercise: value,
      error: error,
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
      const data = await onExerciseDeleteClone({
        workoutId,
        accountId,
        exerciseId,
        sessionId,
        workoutTaskExerciseId,
      });

      return res.status(200).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout and removed exercise.',
        status: 'success',
        exerciseId: data,
      });
    }

    const changedExerciseId = await onExerciseDelete({
      workoutId,
      accountId,
      sessionId,
      exerciseId,
      workoutTaskExerciseId,
    });

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Successfully removed exercise from session.',
      status: 'success',
      exerciseId: changedExerciseId,
    });
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        message: error.message,
        status: 'error',
      });
    }

    if (error instanceof ExerciseNotFoundError) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        message: error.message,
        status: 'error',
      });
    }

    if (error instanceof TaskWithNoExercisesError) {
      return res.status(400).json({
        role: res.locals.state.account.role,
        message: error.message,
        status: 'error',
      });
    }

    if (error instanceof TaskOrderNullError) {
      return res.status(400).json({
        role: res.locals.state.account.role,
        message: error.message,
        status: 'error',
      });
    }
    console.log({ error });
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
  workoutTaskExerciseId: string;
}

const onExerciseDeleteClone = async ({
  workoutId,
  accountId,
  sessionId,
  exerciseId,
  workoutTaskExerciseId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new WorkoutNotFoundError('Workout not found');

  if (!oldWorkout.task_order)
    throw new TaskOrderNullError('Workout has no exercises');

  const mappedTasks = oldWorkout.task_order.map((taskId) => {
    const exercises = oldWorkout.tasks.filter(
      (t) => t.workout_task_id === taskId
    );

    return {
      workout_task_id: taskId,
      exercises: exercises
        .filter((ex) => ex.exercise_id !== exerciseId)
        .map((t) => {
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

  if (mappedTasks.some((t) => t.exercises.length === 0)) {
    throw new TaskWithNoExercisesError('Task has no exercises');
  }

  const { newWorkoutId } = await cloneWorkout({
    accountId,
    workoutId,
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
  workoutTaskExerciseId,
}: CloneMutationParams) => {
  const oldWorkout = await retrieveWorkoutQuery(workoutId);
  if (!oldWorkout) throw new WorkoutNotFoundError('Workout not found');

  const taskExercise = oldWorkout.tasks.find(
    (task) => task.workout_task_exercise_id === workoutTaskExerciseId
  );
  if (!taskExercise || !taskExercise.workout_task_exercise_id)
    throw new ExerciseNotFoundError('Exercise not found');

  const mappedTasks = oldWorkout.task_order.map((taskId) => {
    const exercises = oldWorkout.tasks.filter(
      (t) => t.workout_task_id === taskId
    );

    return {
      workout_task_id: taskId,
      exercises: exercises
        .filter((ex) => ex.exercise_id !== exerciseId)
        .map((t) => {
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

  if (mappedTasks.some((t) => t.exercises.length === 0)) {
    throw new TaskWithNoExercisesError('Task has no exercises');
  }

  const deletedExerciseId = await deleteTaskExerciseById(
    taskExercise.workout_task_exercise_id
  );

  await deleteSetsByExercise(sessionId, exerciseId);
  return deletedExerciseId;
};
