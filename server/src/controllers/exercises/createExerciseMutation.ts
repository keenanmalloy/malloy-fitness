import { db } from 'config/db';
import { Response } from 'express';
import Joi from 'joi';

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

const createExerciseMuscleGroups = async (
  exerciseId: string,
  primary: string[],
  secondary: string[]
) => {
  const preparePrimaryValues = () => {
    if (secondary.length) {
      return `${primary
        .map((id) => `(${exerciseId}, ${id}, 'primary')`)
        .join(',')},`;
    }
    return primary.map((id) => `(${exerciseId}, ${id}, 'primary')`).join(',');
  };

  const prepareSecondaryValues = () => {
    return secondary
      .map((id) => `(${exerciseId}, ${id}, 'secondary')`)
      .join(',');
  };

  const data = await db.query(`
    WITH     
    data(exercise_id, muscle_group_id, "group") AS (
      VALUES 
        ${preparePrimaryValues()}
        ${prepareSecondaryValues()}
      )
    INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, "group")
      SELECT exercise_id, muscle_group_id, "group"
        FROM data
      RETURNING *
    `);

  return data.rows;
};

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

    const query = `
      WITH 
        data(name, description, category, profile, created_by, primary_tracker, secondary_tracker, type) AS (
          VALUES                           
              (
                '${name}', 
                '${description}', 
                ${!!category ? `'${category}'` : null}, 
                ${!!category ? `'${profile}'` : null}, 
                ${createdBy}, 
                '${primaryTracker}', 
                ${!!secondaryTracker ? `'${secondaryTracker}'` : null},
                '${type}'
              )
          )
        INSERT INTO exercises (name, description, category, profile, created_by, primary_tracker, secondary_tracker, type)
          SELECT name, description, category, profile, created_by, primary_tracker, secondary_tracker, type
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);
      const exerciseId = data.rows[0].exercise_id;

      const hasMG =
        primary && secondary && (!!primary.length || !!secondary.length);
      const muscleGroups = hasMG
        ? await createExerciseMuscleGroups(exerciseId, primary, secondary)
        : [];

      const exercise = {
        ...data.rows[0],
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
