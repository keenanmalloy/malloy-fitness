import { db } from 'config/db';
import { Response } from 'express';

export const retrieveSessionQuery = async (res: Response, id: string) => {
  const query = `
  SELECT * FROM sessions
  JOIN workouts ON workouts.workout_id = sessions.workout_id 
  WHERE session_id = $1`;

  const params = [id];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Session does not exist',
        session: null,
      });
    }

    const exercises = await fetchSessionExercises(id);

    const session = {
      ...data.rows[0],
      exercises,
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

const fetchSessionExercises = async (sessionId: string) => {
  const query = `
  SELECT 
    e.exercise_id,
    e.name,
    repetitions,
    reps_in_reserve,
    sets,
    rest_period,
    notes
  FROM exercises e
  JOIN workout_exercises we on e.exercise_id = we.exercise_id
  JOIN workouts w on we.workout_id = w.workout_id
  JOIN sessions s on s.workout_id = w.workout_id
  WHERE session_id = $1`;

  const params = [sessionId];
  const data = await db.query(query, params);
  return data.rows;
};
