import { db } from 'config/db';
import { Response, Request } from 'express';
import { fetchGoogleFitSteps } from './fetchGoogleFitSteps';

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

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Overview fetched successfully',
      sessions,
      steps: stepData,
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

const getTodaysSessions = async (date: string, accountId: string) => {
  const query = `
    SELECT 
        sessions.workout_id,
        sessions.created_by,
        name,
        description,
        category,
        type,
        view,
        session_id,
        started_at,
        ended_at,
        session_dt,
        completed,
        deload
    FROM sessions 
    JOIN workouts ON sessions.workout_id = workouts.workout_id
    WHERE session_dt = $1 AND sessions.created_by = $2
  `;
  const data = await db.query(query, [date, accountId]);
  return data.rows;
};
