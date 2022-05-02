import { db } from 'config/db';
import { Response } from 'express';

export const retrieveSessionWithSetsQuery = async (
  res: Response,
  id: string
) => {
  const query = `
  SELECT
  sessions.session_id,
  sessions.workout_id,
  started_at,
  ended_at,
  completed,
  set_id,
  repetitions,
  weight,
  s.exercise_id,
  set_order,
  workouts.name workout_name,
  e.name exercise_name,
  workouts.category,
  workouts.type,
  video,
  primary_tracker,
  secondary_tracker
FROM sessions
  JOIN sets s on s.session_id = sessions.session_id
  JOIN workouts ON workouts.workout_id = sessions.workout_id
  JOIN exercises e on s.exercise_id = e.exercise_id
WHERE s.session_id = $1`;

  const params = [id];

  try {
    const data = await db.query<SessionSummary>(query, params);

    if (!data.rows.length) {
      return res.status(200).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Session does not exist or has no sets logged',
        session: null,
      });
    }

    const session = {
      name: data.rows[0].workout_name,
      category: data.rows[0].category,
      type: data.rows[0].type,
      session_id: data.rows[0].session_id,
      workout_id: data.rows[0].workout_id,
      started_at: data.rows[0].started_at,
      ended_at: data.rows[0].ended_at,
      completed: data.rows[0].completed,
      exercises: data.rows.map((row) => {
        return {
          name: row.exercise_name,
          exercise_id: row.exercise_id,
          video: row.video,
          sets: data.rows
            .filter((set) => set.exercise_id === row.exercise_id)
            .map((set) => {
              return {
                set_id: set.set_id,
                set_order: set.set_order,
                repetitions: set.repetitions,
                weight: set.weight,
                primary_tracker: set.primary_tracker,
                secondary_tracker: set.secondary_tracker,
              };
            }),
        };
      }),
    };

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Session fetched successfully',
      session,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      session: null,
    });
  }
};

interface SessionSummary {
  // Workout Info
  workout_name: string;
  category: string;
  type: string;
  session_id: string;
  workout_id: string;
  started_at: string;
  ended_at: string;
  completed: boolean;

  // Exercise Info
  exercise_id: string;
  exercise_name: string;
  video: string;

  // Set Info
  set_id: string;
  repetitions: number;
  weight: number;
  set_order: number;
  primary_tracker: string;
  secondary_tracker: string;
}
