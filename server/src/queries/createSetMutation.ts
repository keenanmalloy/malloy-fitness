import { db } from 'config/db';
import Joi from 'joi';
import { Response } from 'express';

interface createSet {
  workout_id: string | number;
  exercise_id: string | number;
  repetitions?: number;
  weight?: number;
  set_order?: number;
}

const createSetSchema = Joi.object({
  exercise_id: Joi.number().required(),
  repetitions: Joi.number().optional(),
  weight: Joi.number().optional(),
  set_order: Joi.number().optional(),
});

export const createSetMutation = async (
  res: Response,
  data: createSet,
  workoutId: any
) => {
  const { error, value, warning } = createSetSchema.validate(data);

  if (error) {
    return res.status(422).json({
      status: 'error',
      message: 'Invalid request data',
      set: value,
      error: error,
    });
  } else {
    const { exercise_id, repetitions, weight, set_order } = data;

    if (
      (typeof repetitions === 'number' && repetitions < 0) ||
      (typeof weight === 'number' && weight < 0)
    ) {
      return res.status(422).json({
        status: 'error',
        message: 'Only positive numbers allowed for weight and reps',
        set: null,
      });
    }

    const query = `
      WITH 
        data(exercise_id, repetitions, weight, workout_id, set_order) AS (
          VALUES                           
              (${exercise_id}, ${repetitions ?? 0}, ${
      weight ?? 0
    }, ${workoutId}, ${set_order ?? 0})
          )
        INSERT INTO sets (exercise_id, repetitions, weight, workout_id, set_order)
          SELECT exercise_id, repetitions, weight, workout_id, set_order
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);
      const set = data.rows[0];

      return res.status(200).json({
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
