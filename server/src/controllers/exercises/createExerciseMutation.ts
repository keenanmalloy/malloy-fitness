import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';
import { createExercise } from 'queries/exercises';
import { createExerciseMuscleGroups } from 'queries/muscle-groups';

interface createExercise {
  name: string;
  description: string;
  category: string;
  primary: string[];
  secondary: string[];
  profile: string;
  primaryTracker: string;
  secondaryTracker: string;
  type: string;
}

const createExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  primaryTracker: Joi.string().max(200).required(),
  secondaryTracker: Joi.string().allow('').max(200).optional(),
  description: Joi.string().max(500).allow('').optional(),
  category: Joi.string().allow('').optional(),
  primary: Joi.array().items(Joi.string(), Joi.number()).optional(),
  secondary: Joi.array().items(Joi.string(), Joi.number()).optional(),
  profile: Joi.string().allow('').valid('short', 'mid', 'long').optional(),
  type: Joi.string()
    .valid('strength', 'hypertrophy', 'physiotherapy', 'cardio')
    .required(),
});

export const createExerciseMutation = async (
  res: Response,
  data: createExercise
) => {
  const { error, value, warning } = createExerciseSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      exercise: value,
      error: error,
    });
  } else {
    const {
      name,
      description,
      category,
      primary, // array of ids
      secondary, // array of ids
      profile,
      primaryTracker,
      secondaryTracker,
      type,
    } = data;

    const createdBy = res.locals.state.account.account_id;

    try {
      const data = await createExercise({
        name,
        description,
        category,
        profile,
        primaryTracker,
        secondaryTracker,
        type,
        createdBy,
      });
      const exerciseId = data.exercise_id;
      if (!exerciseId) {
        throw new Error('Exercise not created');
      }

      const hasMG =
        primary && secondary && (!!primary.length || !!secondary.length);
      const muscleGroups = hasMG
        ? await createExerciseMuscleGroups(exerciseId, primary, secondary)
        : [];

      const exercise = {
        ...data,
        primary: muscleGroups.filter((mg) => mg.group === 'primary'),
        secondary: muscleGroups.filter((mg) => mg.group === 'secondary'),
      };

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Exercise created successfully',
        exercise,
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        //@ts-ignore
        message: error && error.message ? error.message : 'Database error',
        exercise: null,
      });
    }
  }
};
