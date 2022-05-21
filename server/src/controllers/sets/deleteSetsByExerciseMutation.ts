import { Response } from 'express';
import { deleteSetsByExercise } from 'queries/sets';

export const deleteSetsByExerciseMutation = async (
  res: Response,
  sessionId: string,
  exerciseId: string
): Promise<Response> => {
  try {
    const data = await deleteSetsByExercise(sessionId, exerciseId);

    if (!data.rowCount) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Sets do not exist',
        set: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Sets deleted successfully',
      sets: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      set: null,
    });
  }
};
