import { db } from 'config/db';

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
