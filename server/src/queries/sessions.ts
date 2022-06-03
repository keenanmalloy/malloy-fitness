import { db } from 'config/db';
import { sessions_table } from 'utils/databaseTypes';

export const getTodaysSessions = async (date: string, accountId: string) => {
  const query = `
    WITH
    TodaysSessions as (
         SELECT
              session_id
            FROM sessions
        WHERE session_dt = $1
        AND created_by = $2
    ),
     ExerciseVideo as (
         SELECT
             distinct session_id,
             MAX(video) as video
         FROM exercises
         JOIN workout_task_exercises wce on exercises.exercise_id = wce.exercise_id
         JOIN workout_tasks wc on wc.workout_task_id = wce.workout_task_id
         JOIN sessions s on wc.workout_id = s.workout_id
         WHERE session_id IN(select session_id from TodaysSessions)
         GROUP BY 1
     ),
     PreparedSessions as (
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
            ExerciseVideo.video,
            deload
          FROM TodaysSessions
          LEFT OUTER JOIN ExerciseVideo on ExerciseVideo.session_id = TodaysSessions.session_id
          JOIN sessions on TodaysSessions.session_id = sessions.session_id
          JOIN workouts on workouts.workout_id = sessions.workout_id
  )
  
  
    SELECT * FROM PreparedSessions
    `;
  const data = await db.query(query, [date, accountId]);
  return data.rows;
};

export const querySessionById = async (sessionId: string) => {
  const query = `
    SELECT * FROM sessions
    JOIN workouts ON workouts.workout_id = sessions.workout_id 
    WHERE session_id = $1`;

  const params = [sessionId];
  const data = await db.query(query, params);
  return data.rows[0];
};

export const querySessionWorkoutById = async (sessionId: string) => {
  const query = `
  SELECT
  sessions.session_id,
  sessions.workout_id,
  readiness_energy,
  readiness_mood,
  readiness_stress,
  readiness_soreness,
  readiness_sleep,
  started_at,
  ended_at,
  completed,
  workouts.name workout_name,
  workouts.category,
  workouts.task_order,
  workouts.type
FROM sessions
  LEFT JOIN workouts ON workouts.workout_id = sessions.workout_id
WHERE sessions.session_id = $1`;

  const params = [sessionId];
  const data = await db.query(query, params);
  return data.rows[0];
};

export const doesWorkoutHaveSessions = async (workoutId: string) => {
  const query = `SELECT session_id FROM sessions WHERE workout_id = $1`;
  const params = [workoutId];
  const data = await db.query(query, params);
  if (!data)
    return {
      hasSessions: false,
      sessionCount: 0,
    };
  return {
    hasSessions: !!data.rows.length,
    sessionCount: data.rows.length,
  };
};

interface UpdateSessionWorkoutParams {
  sessionId: string;
  workoutId: string;
}

export const updateSessionWorkout = async ({
  sessionId,
  workoutId,
}: UpdateSessionWorkoutParams) => {
  const query = `UPDATE sessions SET workout_id = $1 WHERE session_id = $2 RETURNING session_id`;
  const data = await db.query(query, [workoutId, sessionId]);
  return data.rows[0];
};

interface CreateSessionParams {
  workoutId: string;
  accountId: string;
  sessionDt: string;
}

export const createSession = async ({
  workoutId,
  accountId,
  sessionDt,
}: CreateSessionParams) => {
  const distinguishDate = (date: string) => {
    switch (date) {
      case 'today':
        return 'CURRENT_DATE';
      case 'tomorrow':
        return "CURRENT_DATE + INTERVAL '1 day'";
      default:
        return `TO_TIMESTAMP('${date}', 'YYYY-MM-DD')`;
    }
  };
  const workoutDt = distinguishDate(sessionDt);

  const query = `
    WITH 
      data(session_dt, workout_id, created_by) AS (
        VALUES                           
            (${workoutDt}, ${workoutId}, ${accountId})
        )
      INSERT INTO sessions (session_dt, workout_id, created_by)
        SELECT session_dt, workout_id, created_by
          FROM data
        RETURNING *
    `;

  const data = await db.query<Required<sessions_table>>(query);
  return data.rows[0];
};

export const queryPreviewSessions = async (
  accountId: string,
  selectedDateQuery: string
) => {
  const query = `
  SELECT session_id, session_dt, workouts.type FROM sessions
  LEFT JOIN workouts 
    ON workouts.workout_id = sessions.workout_id
  WHERE workouts.created_by = ${accountId} AND 
  DATE_TRUNC('month', session_dt) 
      BETWEEN TIMESTAMP '${selectedDateQuery}' - INTERVAL '2 month' AND TIMESTAMP '${selectedDateQuery}' + INTERVAL '1 month'
`;

  const data = await db.query(query);
  return data.rows;
};

export const deleteSessionById = async (sessionId: string) => {
  const query = `DELETE FROM sessions WHERE session_id = $1`;
  const params = [sessionId];
  const data = await db.query(query, params);
  return data.rowCount;
};

interface EndSessionParams {
  sessionId: string;
  accountId: string;
}

export const endSession = async ({
  sessionId,
  accountId,
}: EndSessionParams) => {
  const query = `
    UPDATE sessions
    SET ended_at = $1, completed = true
    WHERE session_id = $2 AND created_by = $3
    RETURNING session_id;
  `;

  const startedAt = new Date();
  const params = [startedAt, sessionId, accountId];

  const data = await db.query<Required<Pick<sessions_table, 'session_id'>>>(
    query,
    params
  );

  return data.rows[0].session_id;
};
