import { Response } from 'express';
import { fetchSessionExercises } from 'queries/sessionExercises';
import { querySessionById } from 'queries/sessions';

export const retrieveSessionQuery = async (res: Response, id: string) => {
  try {
    const data = await querySessionById(id);
    const exercises = await fetchSessionExercises(id);

    const session = {
      ...data,
      exercises,
    };

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Session fetched successfully',
      session,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      session: null,
    });
  }
};
