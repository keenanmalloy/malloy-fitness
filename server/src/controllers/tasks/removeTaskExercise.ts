import { Response } from 'express';
import {
  doesWorkoutHaveSessions,
  updateSessionWorkout,
} from 'queries/sessions';
import { deleteSetsByExercise } from 'queries/sets';

import {
  cloneWorkoutTasksWithExercises,
  deleteWorkoutTask,
} from 'queries/workoutTasks';
import {
  cloneWorkout,
  retrieveWorkoutQuery,
  updateWorkoutTaskOrder,
} from 'queries/workouts';
import { deleteTaskExerciseById } from 'queries/workoutTaskExercises';

export const removeTaskExercise = async (
  res: Response,
  sessionId: string,
  exerciseId: string,
  workoutId: string,
  workoutTaskExerciseId: string
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
        workoutTaskExerciseId,
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
      workoutTaskExerciseId,
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
      exercises: exercises
        .filter((ex) => ex.exercise_id === exerciseId)
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

  await cloneWorkoutTasksWithExercises({
    newWorkoutId,
    payload: [...mappedTasks],
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
  if (!oldWorkout) throw new Error('Workout not found');

  const taskExercise = oldWorkout.tasks.find(
    (task) => task.workout_task_exercise_id === workoutTaskExerciseId
  );
  if (!taskExercise || !taskExercise.workout_task_exercise_id)
    throw new Error('WorkoutExercise not found');

  const deletedExerciseId = await deleteTaskExerciseById(
    taskExercise.workout_task_exercise_id
  );

  await deleteSetsByExercise(sessionId, exerciseId);
  return deletedExerciseId;
};
