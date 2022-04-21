import { db } from 'config/db';
import { Request, Response } from 'express';

export const retrievePreviewWorkoutsQuery = async (
  req: Request,
  res: Response
) => {
  // ex. Wed Apr 20 2022 19:50:53 GMT-0700 (Pacific Daylight Time)
  const selectedDateQuery = req.query.date as string;

  const accountId = res.locals.state.account.account_id;
  const query = `
    SELECT workout_id, workout_dt, type FROM workouts 
    WHERE created_by = ${accountId} AND 
    DATE_TRUNC('month', workout_dt) 
        BETWEEN TIMESTAMP '${selectedDateQuery}' - INTERVAL '2 month' AND TIMESTAMP '${selectedDateQuery}' + INTERVAL '1 month'
  `;

  try {
    const data = await db.query(query);

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Workouts fetched successfully',
      status: 'success',
      workouts: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      workouts: null,
    });
  }
};
