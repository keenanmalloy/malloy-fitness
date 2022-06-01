import { db } from 'config/db';
import { Request, Response } from 'express';
import { queryPreviewSessions } from 'queries/sessions';

export const retrievePreviewSessionsQuery = async (
  req: Request,
  res: Response
) => {
  // ex. Wed Apr 20 2022 19:50:53 GMT-0700 (Pacific Daylight Time)
  const selectedDateQuery = req.query.date as string;

  if (!selectedDateQuery) {
    return res.status(400).json({
      status: 'error',
      message: 'No date provided',
      sessions: null,
    });
  }

  try {
    const accountId = res.locals.state.account.account_id;
    const sessions = await queryPreviewSessions(accountId, selectedDateQuery);

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Sessions fetched successfully',
      status: 'success',
      sessions,
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
