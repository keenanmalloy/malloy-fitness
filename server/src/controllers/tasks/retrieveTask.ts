import { Response } from 'express';
import { queryWorkoutExerciseRecord } from 'queries/sets';
import {
  queryExerciseIdsByWorkoutId,
  queryWorkoutTaskExercisesByWorkoutTaskId,
} from 'queries/workoutTaskExercises';

export const retrieveTask = async (
  res: Response,
  sessionId: string,
  workoutTaskId: string
) => {
  try {
    const task = await queryWorkoutTaskExercisesByWorkoutTaskId(workoutTaskId);
    if (!task || !task.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found',
      });
    }

    const taskExercises = await queryExerciseIdsByWorkoutId(task[0].workout_id);

    // @@TODO
    // const sessionSetRecord = await queryWorkoutExerciseRecord(
    //   mainExercise.workout_id,
    //   exerciseId,
    //   res.locals.state.account.account_id
    // );

    const taskOrder = task[0].task_order as string[];

    // get index in array for current exercise
    const currentExerciseIndex = taskOrder.findIndex(
      (id) => id === workoutTaskId
    );

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Task fetched successfully',
      status: 'success',
      task: task,
      record: null,

      // The exercise IDs within the session so we can filter
      exerciseIds: taskExercises.map((e) => e.exercise_id),
      next: {
        order: {
          workoutTaskId: taskOrder[currentExerciseIndex + 1],
        },
      },
      prev: {
        order: {
          workoutTaskId: taskOrder[currentExerciseIndex - 1],
        },
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      exercises: null,
    });
  }
};
