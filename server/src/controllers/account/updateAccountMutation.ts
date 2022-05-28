import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';
import { update } from 'utils/update';

const updateMuscleGroupSchema = Joi.object({
  name: Joi.string().max(200).optional(), // username not allowed to be empty
  given_name: Joi.string().allow('').max(200).optional(),
  family_name: Joi.string().allow('').max(200).optional(),
  description: Joi.string().max(500).allow('').optional(),
  avatar_url: Joi.string().max(200).allow('').optional(),
  phone: Joi.string().max(20).allow('').optional(),
  gender: Joi.string().allow('male', 'female', 'prefer not to say').optional(),
  dob: Joi.string().max(30).allow('').optional(),
  weight: Joi.number().allow('').allow(null).optional(),
  height: Joi.number().allow('').allow(null).optional(),
  country: Joi.string().max(2).allow('').optional(),
  city: Joi.string().max(50).allow('').optional(),
});

export const updateAccountMutation = async (
  res: Response,
  data: Record<string, string>
) => {
  // if object is empty, respond with error
  if (Object.keys(data).length === 0) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Missing request data',
    });
  }

  const { error, value, warning } = updateMuscleGroupSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      field: value,
      error: error,
    });
  } else {
    const { query, params } = update({
      tableName: 'accounts',
      conditions: {
        account_id: res.locals.state.account.account_id,
      },
      data,
    });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.status(404).json({
          role: res.locals.state.account.role,
          status: 'error',
          message: 'Field does not exist',
        });
      }

      return res.status(200).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Field updated successfully',
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        message: 'Database error',
      });
    }
  }
};
