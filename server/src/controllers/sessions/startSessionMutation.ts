import { Response } from 'express';
import { startSession } from 'queries/sessions';

export const startSessionMutation = async (res: Response, id: string) => {
  const accountId = res.locals.state.account.account_id;

  try {
    const data = await startSession(id, accountId);
    if (!data) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'session does not exist',
        session: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'session updated successfully',
      session: data,
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
