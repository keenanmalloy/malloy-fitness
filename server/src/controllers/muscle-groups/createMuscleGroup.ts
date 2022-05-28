import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';
import { createMuscleGroup } from 'queries/muscle-groups';

interface CreateMuscleGroup {
  name: string;
  description: string;
  image: string;
}

const createMuscleGroupSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(500).allow('').optional(),
  image: Joi.string().max(500).allow(null).optional(),
});

export const createMuscleGroupMutation = async (
  res: Response,
  data: CreateMuscleGroup
) => {
  const { error, value, warning } = createMuscleGroupSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      muscleGroup: value,
      error: error,
    });
  } else {
    const { name, description, image } = data;

    try {
      const data = await createMuscleGroup({
        name,
        description,
        image,
      });

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Muscle-group created successfully',
        muscleGroup: data,
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        //@ts-ignore
        message: error && error.message ? error.message : 'Database error',
        muscleGroup: null,
      });
    }
  }
};
