import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';
import { update } from 'utils/update';

const updateMuscleGroupSchema = Joi.object({
  name: Joi.string().min(3).max(200).optional(),
  description: Joi.string().max(500).allow('').optional(),
  image: Joi.string().max(500).allow(null).optional(),
});

export const updateMuscleGroupMutation = async (
  res: Response,
  data: Record<string, string>,
  id: string
) => {
  const { error, value, warning } = updateMuscleGroupSchema.validate(data);
  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      muscleGroup: value,
      error: error,
    });
  } else {
    const { query, params } = update({
      tableName: 'muscle_groups',
      conditions: {
        muscle_group_id: id,
      },
      data,
    });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.status(404).json({
          role: res.locals.state.account.role,
          status: 'error',
          message: 'Muscle-group does not exist',
          muscleGroup: null,
        });
      }

      return res.status(200).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Muscle-group updated successfully',
        muscleGroup: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        message: 'Database error',
        muscleGroup: null,
      });
    }
  }
};
