import { db } from 'config/db';
import { Response } from 'express';
import { deleteSessionById } from 'queries/sessions';

export const deleteSessionMutation = async (res: Response, id: string) => {
  try {
    const rowCount = await deleteSessionById(id);

    if (!rowCount) {
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
      message: 'session deleted successfully',
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
