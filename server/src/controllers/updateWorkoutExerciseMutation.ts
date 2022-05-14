import { db } from 'config/db';
import { Response } from 'express';

export const updateWorkoutExerciseMutation = async (res: Response) => {
  return res.status(500).json({
    status: 'error',
    message: 'Database error',
    exercise: null,
  });
};
