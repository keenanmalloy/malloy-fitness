import {
  doesWorkoutHaveSessions,
  queryExercisesByWorkoutId,
  queryWorkoutById,
} from 'queries/workouts';
import { Response } from 'express';

export const retrieveWorkoutQuery = async (res: Response, id: string) => {
  try {
    const workoutData = await queryWorkoutById(id);
    if (!workoutData) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Workout does not exist',
        workout: null,
      });
    }

    const exercisesData = await queryExercisesByWorkoutId(id);

    const mappedTasks =
      workoutData.task_order &&
      workoutData.task_order.map((taskId: string) => {
        const exercises = exercisesData.filter(
          (e) => e.workout_task_id === taskId
        );

        return {
          workout_task_id: taskId,
          exercises: exercises.map((exercise) => {
            return {
              name: exercise.name,
              description: exercise.description,
              exercise_id: exercise.exercise_id,
              category: exercise.category,
              profile: exercise.profile,
              video: exercise.video,
              sets: exercise.sets,
              repetitions: exercise.repetitions,
              repsInReserve: exercise.reps_in_reserve,
              restPeriod: exercise.rest_period,
            };
          }),
        };
      });

    const hasSessions = await doesWorkoutHaveSessions(id);

    const workout = {
      name: workoutData.name,
      description: workoutData.description,
      category: workoutData.category,
      workout_id: workoutData.workout_id,
      type: workoutData.type,
      task_order: workoutData.task_order,
      tasks: mappedTasks,
      hasSessions,
    };

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Workout fetched successfully',
      workout,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      workout: null,
    });
  }
};
