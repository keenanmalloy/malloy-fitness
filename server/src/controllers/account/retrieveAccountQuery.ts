import { Request, Response } from 'express';
import { getAccountById } from 'queries/account';

export const retrieveMeQuery = async (req: Request, res: Response) => {
  try {
    const accountId = res.locals.state.account.account_id;
    const account = await getAccountById(accountId);

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'User logged in',
      account,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Session does not exist',
      account: null,
    });
  }
};
