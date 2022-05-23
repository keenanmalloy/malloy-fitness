import { Response } from 'express';
import {
  cloneScheduleWorkout,
  retrieveWorkoutQuery,
  updateWorkoutTaskOrder,
} from 'queries/workouts';
import { cloneWorkoutTasksWithExercises } from 'queries/workoutTasks';

export const cloneScheduleWorkoutMutation = async (
  res: Response,
  workoutId: string,
  date: string
) => {
  const accountId = res.locals.state.account.account_id;

  try {
    const workout = await retrieveWorkoutQuery(workoutId);
    if (!workout) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        message: 'Failed',
        error: 'Workout failed to fetch, does it exist?',
      });
    }

    const { newWorkoutId } = await cloneScheduleWorkout({
      workoutId,
      accountId,
      date,
    });

    if (!workout.tasks || workout.tasks.length === 0) {
      return res.status(201).json({
        role: res.locals.state.account.role,
        message: 'Successfully cloned workout',
        status: 'success',
        workoutId: newWorkoutId,
      });
    }

    const newWorkoutTasks = await cloneWorkoutTasksWithExercises({
      newWorkoutId,
      payload: workout.task_order.map((taskId, index) => {
        const exercises = workout.tasks.filter(
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
      }),
    });

    await updateWorkoutTaskOrder({
      workoutId: newWorkoutId,
      taskOrder: JSON.stringify([
        ...new Set(newWorkoutTasks.map((task) => task.workout_task_id)),
      ]),
    });

    return res.status(201).json({
      role: res.locals.state.account.role,
      message: 'Workout Successfully Cloned',
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: 'Failed',
      error: 'Workout failed to clone',
    });
  }
};
