import { Response } from 'express';
import { queryExerciseToContinueFrom } from 'queries/sets';

export const continueSession = async (res: Response, id: string) => {
  try {
    const data = await queryExerciseToContinueFrom({ sessionId: id });
    if (!data) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'could not continue - no exercise found',
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'continuing session',
      url: `${process.env.APP_ENDPOINT}/sessions/${id}/exercises/${data.exercise_id}`,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'database error',
    });
  }
};
