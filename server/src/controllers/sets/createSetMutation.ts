import { db } from 'config/db';
import Joi from 'joi';
import { Response } from 'express';
import { createSet } from 'queries/sets';

interface createSet {
  session_id: string | number;
  exercise_id: string;
  repetitions?: number;
  weight?: number;
}

const createSetSchema = Joi.object({
  exercise_id: Joi.number().required(),
  repetitions: Joi.number().optional(),
  weight: Joi.number().optional(),
});

export const createSetMutation = async (
  res: Response,
  data: createSet,
  sessionId: string
) => {
  const { error, value, warning } = createSetSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      set: value,
      error: error,
    });
  } else {
    const { exercise_id, repetitions, weight } = data;

    if (
      (typeof repetitions === 'number' && repetitions < 0) ||
      (typeof weight === 'number' && weight < 0)
    ) {
      return res.status(422).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Only positive numbers allowed for weight and reps',
        set: null,
      });
    }

    try {
      const set = await createSet({
        sessionId,
        exerciseId: exercise_id,
        repetitions: repetitions,
        weight: weight,
      });

      return res.status(200).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Set created successfully',
        set,
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        //@ts-ignore
        message: error && error.message ? error.message : 'Database error',
        set: null,
      });
    }
  }
};
