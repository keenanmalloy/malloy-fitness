import { Response } from 'express';
import { queryGoalSettings } from 'queries/settings';

export const fetchGoalsQuery = async (res: Response) => {
  const accountId = res.locals.state.account.account_id;

  try {
    const goals = await queryGoalSettings(accountId);
    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Goals fetched successfully',
      goals,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      goals: null,
    });
  }
};
