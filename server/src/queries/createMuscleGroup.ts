import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';

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
      status: 'error',
      message: 'Invalid request data',
      muscleGroup: value,
      error: error,
    });
  } else {
    const { name, description, image } = data;

    const query = `
      WITH 
        data(name, description, image) AS (
          VALUES                           
              ('${name}', '${description}', '${image}')
          )
        INSERT INTO muscle_groups (name, description, image)
          SELECT name, description, image
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);

      return res.status(201).json({
        status: 'success',
        message: 'Muscle-group created successfully',
        muscleGroup: data.rows[0],
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
