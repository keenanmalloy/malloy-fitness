import { Response } from 'express';
import { querySetsBySession } from 'queries/sets';

export const retrieveSetsQuery = async (
  res: Response,
  sessionId: string
): Promise<Response> => {
  try {
    const data = await querySetsBySession(sessionId);

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
