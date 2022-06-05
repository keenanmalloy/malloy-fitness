import { Response } from 'express';
import Joi from 'joi';
import { createSession } from 'queries/sessions';

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

    try {
      const accountId = res.locals.state.account.account_id;
      const session = await createSession({
        workoutId: workout_id,
        accountId,
        sessionDt: new Date(session_dt).toISOString(),
      });

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Session created successfully',
        session,
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
