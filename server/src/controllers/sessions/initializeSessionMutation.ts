import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';

interface CreateSession {
  session_dt: string;
}

const createSessionSchema = Joi.object({
  session_dt: Joi.string().required(),
});

export const initializeSessionMutation = async (
  res: Response,
  data: CreateSession
) => {
  console.log({ data });
  const { error, value, warning } = createSessionSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      session: value,
      error: error,
    });
  }
  const { session_dt } = data;

  try {
    const workoutId = await createEmptyWorkout(
      res.locals.state.account.account_id,
      session_dt
    );

    const newSession = await createSession(
      session_dt,
      workoutId,
      res.locals.state.account.account_id
    );

    return res.status(201).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Session created successfully',
      session: newSession,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      //@ts-ignore
      message: error && error.message ? error.message : 'Database error',
      session: null,
    });
  }
};

const createEmptyWorkout = async (accountId: string, session_dt: string) => {
  const date = new Date(session_dt).toISOString();
  const formattedDate = new Intl.DateTimeFormat('en-US').format(new Date(date));

  const query = `
        WITH
        data(name, view, created_by, type) AS (
            VALUES
                ('${formattedDate} a', 'private', ${accountId}, 'strength')
            )
        INSERT INTO workouts (name, view, created_by, type)
            SELECT name, view, created_by, type
            FROM data
        RETURNING workout_id
        
    `;

  const data = await db.query(query);
  if (!data.rowCount) throw new Error('Failed to create workout');
  return data.rows[0].workout_id;
};

const createSession = async (
  sessionDate: string,
  workoutId: string,
  accountId: string
) => {
  const date = new Date(sessionDate).toISOString();
  const query = `
      WITH 
        data(session_dt, workout_id, created_by) AS (
          VALUES                           
              (timestamp '${date}', ${workoutId}, ${accountId})
          )
        INSERT INTO sessions (session_dt, workout_id, created_by)
          SELECT session_dt, workout_id, created_by
            FROM data
          RETURNING *
      `;

  const data = await db.query(query);
  if (!data.rowCount) throw new Error('Failed to create workout');
  return data.rows[0];
};
