import { db } from 'config/db';
import Joi from 'joi';
import { update } from 'utils/update';
import { Response } from 'express';
import { WORKOUT_CATEGORIES, WORKOUT_TYPES } from 'test/helpers/env';

const updateWorkoutSchema = Joi.object({
  name: Joi.string().min(1).max(64).optional(),
  description: Joi.string().max(500).allow('').optional(),
  category: Joi.string().allow(WORKOUT_CATEGORIES.join(', ')).optional(),
  type: Joi.string().allow(WORKOUT_TYPES.join(', ')).optional(),
});

export const updateWorkoutMutation = async (
  res: Response,
  data: Record<string, string>,
  id: string
) => {
  const { error, value, warning } = updateWorkoutSchema.validate(data);

  if (error || Object.keys(value).length === 0) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      workout: value,
      error: error,
    });
  } else {
    const { query, params } = update({
      tableName: 'workouts',
      conditions: {
        workout_id: id,
      },
      data,
    });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.status(404).json({
          role: res.locals.state.account.role,
          status: 'error',
          message: 'Workout does not exist',
          workout: null,
        });
      }

      return res.status(200).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Workout updated successfully',
        workout: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        message: 'Database error',
        workout: null,
      });
    }
  }
};
