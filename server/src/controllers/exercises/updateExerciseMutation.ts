import { db } from 'config/db';
import Joi from 'joi';
import { update } from 'utils/update';
import { Response } from 'express';

const updateExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(200).optional(),
  description: Joi.string().max(500).allow('').optional(),
  category: Joi.string().allow('').allow(null).optional(),
  video: Joi.string().allow(null).optional(),
  profile: Joi.string()
    .allow(null)
    .allow('')
    .valid('short', 'mid', 'long')
    .optional(),
  type: Joi.string().valid(
    'strength',
    'hypertrophy',
    'physiotherapy',
    'cardio'
  ),
  primary_tracker: Joi.string().max(200).optional(),
  secondary_tracker: Joi.string().allow('').max(200).optional(),
});

export const updateExerciseMutation = async (
  res: Response,
  data: Record<string, string>,
  id: string
) => {
  const { error, value, warning } = updateExerciseSchema.validate(data);

  if (error || Object.keys(data).length === 0) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      exercise: value,
      error: error,
    });
  } else {
    const { query, params } = update({
      tableName: 'exercises',
      conditions: {
        exercise_id: id,
      },
      data,
    });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.status(404).json({
          role: res.locals.state.account.role,
          status: 'error',
          message: 'Exercise does not exist',
          exercise: null,
        });
      }

      return res.status(200).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Exercise updated successfully',
        exercise: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        message: 'Database error',
        exercise: null,
      });
    }
  }
};
