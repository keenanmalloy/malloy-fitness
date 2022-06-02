import { db } from 'config/db';
import Joi from 'joi';
import { update } from 'utils/update';
import { Response } from 'express';

const updateSessionSchema = Joi.object({
  started_at: Joi.string().optional(),
  ended_at: Joi.string().optional(),
  session_dt: Joi.string().optional(),
  deload: Joi.boolean().optional(),
  readiness_energy: Joi.number().min(1).max(5).optional(),
  readiness_mood: Joi.number().min(1).max(5).optional(),
  readiness_stress: Joi.number().min(1).max(5).optional(),
  readiness_soreness: Joi.number().min(1).max(5).optional(),
  readiness_sleep: Joi.number().min(1).max(5).optional(),
});

export const updateSessionMutation = async (
  res: Response,
  data: Record<string, string>,
  id: string
) => {
  const { error, value, warning } = updateSessionSchema.validate(data);

  if (error || !Object.keys(data).length) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      session: value,
      error: error,
    });
  } else {
    const { query, params } = update({
      tableName: 'sessions',
      conditions: {
        session_id: id,
      },
      data,
    });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.status(404).json({
          role: res.locals.state.account.role,
          status: 'error',
          message: 'Session does not exist',
          session: null,
        });
      }

      return res.status(200).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Session updated successfully',
        session: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        message: 'Database error',
        session: null,
      });
    }
  }
};
