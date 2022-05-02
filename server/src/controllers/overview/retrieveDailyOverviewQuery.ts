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
  console.log({ date });
  const query = `
  WITH
  today_sessions as (
       SELECT
              session_id
          FROM sessions
      WHERE session_dt = $1
      AND created_by = $2
  ),
   exercise_video_image as (
       SELECT
           distinct session_id,
           MAX(video) as video
       FROM exercises
       JOIN workout_exercises we on exercises.exercise_id = we.exercise_id
       JOIN sessions s on we.workout_id = s.workout_id
       WHERE session_id IN(select session_id from today_sessions)
       GROUP BY 1
   ),
  data as (
   SELECT
          sessions.workout_id,
          sessions.created_by,
          workouts.name,
          workouts.description,
          workouts.category,
          workouts.type,
          workouts.view,
          sessions.session_id,
          started_at,
          ended_at,
          session_dt,
          completed,
          video,
          deload
      FROM sessions
      JOIN workouts ON sessions.workout_id = workouts.workout_id
      JOIN exercise_video_image on exercise_video_image.session_id = sessions.session_id
  )
  
  SELECT * FROM data
  `;
  const data = await db.query(query, [date, accountId]);
  return data.rows;
};
