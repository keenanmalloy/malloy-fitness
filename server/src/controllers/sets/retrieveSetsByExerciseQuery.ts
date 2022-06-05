import { Response } from 'express';
import { querySetsByExercise } from 'queries/sets';

export const retrieveSetsByExerciseQuery = async (
  res: Response,
  sessionId: any,
  exerciseId: any
) => {
  try {
    const data = await querySetsByExercise(sessionId, exerciseId);

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Sets fetched successfully',
      status: 'success',
      sets: data,
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
