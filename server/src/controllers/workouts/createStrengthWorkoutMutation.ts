import { db } from 'config/db';
import Joi from 'joi';
import { Response } from 'express';

type Exercises = {
  id: string | number;
  priority?: number;
  order?: number;
}[];

interface createWorkout {
  name: string;
  description: string;
  category: string;
  created_by: string | number;
  exercises: Exercises;
}

const createWorkoutSchema = Joi.object({
  name: Joi.string().min(3).max(64).required(),
  description: Joi.string().max(250).allow('').optional(),
  category: Joi.string().required(),
  exercises: Joi.array()
    .items(
      Joi.object().keys({
        id: Joi.any().required(),
        order: Joi.number().optional().allow(null),
        priority: Joi.number().optional().allow(null),
        repetitions: Joi.any().optional().allow(null),
        repsInReserve: Joi.any().optional().allow(null),
        restPeriod: Joi.any().optional().allow(null),
        sets: Joi.any().optional().allow(null),
      })
    )
    .required(),
});

const createWorkoutExercisesLink = async (
  workoutId: string,
  exercises: Exercises
) => {
  const preparePrimaryValues = () => {
    return exercises
      .map((exercise) => {
        return `(${workoutId}, ${exercise.id}, ${exercise.order ?? 0}, ${
          exercise.priority ?? 0
        })`;
      })
      .join(',');
  };

  const data = await db.query(`
    WITH     
    data(workout_id, exercise_id, "order", priority) AS (
      VALUES 
        ${preparePrimaryValues()}
      )
    INSERT INTO workout_exercises (workout_id, exercise_id, "order", priority)
      SELECT workout_id, exercise_id, "order", priority
        FROM data
      RETURNING *
    `);

  return data.rows;
};

export const createStrengthWorkoutMutation = async (
  res: Response,
  data: createWorkout
) => {
  if (!data.exercises) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: `Invalid request data, missing exercises.`,
      workout: null,
      example: {
        name: 'My Workout',
        description: '',
        category: 'Legs',
        exercises: [
          { id: 1, order: 1 },
          { id: 2, order: 2 },
          { id: 3, order: 3, priority: 1 },
          { id: 4, order: 3, priority: 2 },
          { id: 5, order: 3, priority: 3 },
        ],
      },
    });
  }

  const { error, value, warning } = createWorkoutSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      workout: value,
      error: error,
    });
  } else {
    const { name, description, category, exercises } = data;
    const accountId = res.locals.state.account.account_id;

    const validateExercises = (exercises: Exercises) => {
      return exercises.find((ex) => Number.isNaN(parseInt(ex.id.toString())));
    };

    if (validateExercises(exercises)) {
      return res.status(400).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Invalid exercise ID',
        exercises: exercises,
        workout: null,
      });
    }

    const exerciseOrder = JSON.stringify(
      exercises
        .sort((a, b) => {
          if (a.order && b.order) {
            return a.order - b.order;
          } else {
            return 0;
          }
        })
        .map((e) => {
          return e.id;
        })
    );

    const query = `
      WITH 
        data(name, description, category, created_by, type, exercise_order) AS (
          VALUES                           
              ('${name}', '${description}', '${category}', ${accountId}, 'strength', '${exerciseOrder}'::jsonb)
          )
        INSERT INTO workouts (name, description, category, created_by, type, exercise_order)
          SELECT name, description, category, created_by, type, exercise_order
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);
      const workoutId = data.rows[0].workout_id;

      await createWorkoutExercisesLink(workoutId, exercises);
      const workout = data.rows[0];

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Workout created successfully',
        workout,
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: 'error',
        //@ts-ignore
        message: error && error.message ? error.message : 'Database error',
        workout: null,
        error: error,
      });
    }
  }
};
