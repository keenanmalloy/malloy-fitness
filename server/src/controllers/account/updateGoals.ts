import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';
import { update } from 'utils/update';

const updateGoalsSchema = Joi.object({
  daily_steps_goal: Joi.number().optional(),
  weekly_cardio_minutes_goal: Joi.number().optional(),
  body_weight_goal: Joi.number().optional(),
});

export const updateGoalsMutation = async (
  res: Response,
  data: Record<string, string>
) => {
  const accountId = res.locals.state.account.account_id;
  const { error, value, warning } = updateGoalsSchema.validate(data);

  console.log({ data });
  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      goals: value,
      error: error,
    });
  } else {
    const { query, params } = update({
      tableName: 'settings',
      conditions: {
        account_id: accountId,
      },
      data,
    });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        throw new Error('Could not fetch goals');
      }

      return res.status(200).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Goal updated successfully',
        goals: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        message: 'Database error',
        goals: null,
      });
    }
  }
};
