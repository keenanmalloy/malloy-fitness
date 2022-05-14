import { db } from 'config/db';
import Joi from 'joi';
import { Response } from 'express';

interface addExercise {
  exerciseId: number | string;
}

const addExerciseSchema = Joi.object({
  exerciseId: Joi.alternatives(Joi.string(), Joi.number()).required(),
});

export const addExerciseToWorkoutMutation = async (
  res: Response,
  data: addExercise,
  workoutId: string
) => {
  const { error, value, warning } = addExerciseSchema.validate(data);

  if (error) {
    return res.status(422).json({
      role: res.locals.state.account.role,
      status: 'error',
      message: 'Invalid request data',
      exercise: value,
      error: error,
    });
  } else {
    const { exerciseId } = data;

    if (Number.isNaN(parseInt(exerciseId.toString()))) {
      return res.status(422).json({
        role: res.locals.state.account.role,
        status: 'error',
        //@ts-ignore
        message: 'Invalid exercise ID',
      });
    }

    const query = `
      WITH 
        data(workout_id, exercise_id) AS (
          VALUES                           
              (${workoutId}, ${exerciseId})
          )
        INSERT INTO workout_exercises (workout_id, exercise_id)
          SELECT workout_id, exercise_id
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);
      const exercise = data.rows[0];

      return res.status(201).json({
        role: res.locals.state.account.role,
        status: 'success',
        message: 'Exercise added successfully',
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
