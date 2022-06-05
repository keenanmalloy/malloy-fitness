import { endSession } from 'queries/sessions';

export const endSessionMutation = async (res: any, id: string) => {
  try {
    const sessionId = await endSession({
      accountId: res.locals.state.account.account_id,
      sessionId: id,
    });

    if (!sessionId) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'session does not exist',
        sessionId: null,
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'session ended',
      sessionId: sessionId,
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
