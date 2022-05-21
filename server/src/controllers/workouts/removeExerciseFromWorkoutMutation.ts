import { Response } from 'express';
import { deleteWorkoutTask } from 'queries/workoutTasks';

export const removeExerciseFromWorkoutMutation = async (
  res: Response,
  workoutTaskId: string
) => {
  try {
    await deleteWorkoutTask(workoutTaskId);

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Exercise removed successfully',
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      exercise: null,
    });
  }
};
