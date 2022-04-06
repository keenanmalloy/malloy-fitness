import { db } from 'config/db';
import Joi from 'joi';
import { update } from 'utils/update';
import { Response } from 'express';

const updateWorkoutExerciseSchema = Joi.object({
  notes: Joi.string().optional(),
  sets: Joi.string().optional(),
  repetitions: Joi.string().optional(),
  reps_in_reserve: Joi.string().optional(),
  rest_period: Joi.string().optional(),
});

export const updateWorkoutExerciseMetadataMutation = async (
  res: Response,
  data: Record<string, string>,
  workoutId: string,
  exerciseId: string
) => {
  const { error, value, warning } = updateWorkoutExerciseSchema.validate(data);
  if (error) {
    return res.status(422).json({
      status: 'error',
      message: 'Invalid request data',
      exercise: value,
      error: error,
    });
  } else {
    const { query, params } = update({
      tableName: 'workout_exercises',
      conditions: {
        workout_id: workoutId,
        exercise_id: exerciseId,
      },
      data,
    });

    console.log({ query, params });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.status(404).json({
          status: 'error',
          message: 'Exercise does not exist',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Exercise updated successfully',
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
