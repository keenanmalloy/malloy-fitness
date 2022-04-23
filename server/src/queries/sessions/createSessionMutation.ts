import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';

interface CreateSession {
  session_dt: string;
  workout_id: string;
}

const createSessionSchema = Joi.object({
  workout_id: Joi.string().required(),
  session_dt: Joi.string().optional(),
});

export const createSessionMutation = async (
  res: Response,
  data: CreateSession
) => {
  const { error, value, warning } = createSessionSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      session: value,
      error: error,
    });
  } else {
    const { session_dt, workout_id } = data;

    const date = new Date(session_dt).toISOString();

    const query = `
      WITH 
        data(session_dt, workout_id, created_by) AS (
          VALUES                           
              (timestamp '${date}', ${workout_id}, ${res.locals.state.account.account_id})
          )
        INSERT INTO sessions (session_dt, workout_id, created_by)
          SELECT session_dt, workout_id, created_by
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Session created successfully',
        session: data.rows[0],
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
  }
};
