import { db } from 'config/db';
import { Response, Request } from 'express';
import { fetchGoogleFitSteps } from './fetchGoogleFitSteps';
import { getTodaysSessions } from 'queries/sessions';
import { getGoalSettings } from 'queries/settings';

export const retrieveDailyOverviewQuery = async (
  req: Request,
  res: Response
) => {
  const dateQuery = req.query.date as string;
  if (!dateQuery) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required date param',
      sessions: null,
    });
  }

  const startTimeQuery = req.query.startTime as string;
  const endTimeQuery = req.query.endTime as string;
  if (!startTimeQuery || !endTimeQuery) {
    return res.status(400).json({
      error: 'Missing start / end time query params (UNIX) milliseconds',
    });
  }

  const stepData = await fetchGoogleFitSteps(
    req,
    res,
    startTimeQuery,
    endTimeQuery
  );

  try {
    const dateQuery = req.query.date as string;
    const accountId = res.locals.state.account.account_id;
    const sessions = await getTodaysSessions(dateQuery, accountId);

    const goals = await getGoalSettings({ accountId });

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Overview fetched successfully',
      sessions,
      steps: stepData,
      goals,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      sessions: null,
    });
  }
};
