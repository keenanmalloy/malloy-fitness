import { Response } from 'express';
import { deleteSet } from 'queries/sets';

export const deleteSetMutation = async (res: Response, id: string) => {
  try {
    const data = await deleteSet(id);

    if (!data.rowCount) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Set does not exist',
      });
    }

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Set deleted successfully',
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
    });
  }
};
