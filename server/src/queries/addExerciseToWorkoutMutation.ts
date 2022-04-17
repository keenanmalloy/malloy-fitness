import { db } from 'config/db';
import Joi from 'joi';

interface addExercise {
  order?: number;
  priority?: number;
  exerciseId: number | string;
}

interface Response {
  status: string;
  message: string;
  exercise: any;
  error?: any;
}

const addExerciseSchema = Joi.object({
  order: Joi.alternatives(Joi.string(), Joi.number()).optional(),
  priority: Joi.alternatives(Joi.string(), Joi.number()).optional(),
  exerciseId: Joi.alternatives(Joi.string(), Joi.number()).required(),
});

export const addExerciseToWorkoutMutation = async (
  res: any,
  data: addExercise,
  workoutId: string
): Promise<Response> => {
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
    const { order, priority, exerciseId } = data;

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
        data(workout_id, exercise_id, "order", priority) AS (
          VALUES                           
              (${workoutId}, ${exerciseId}, ${order ?? 0}, ${priority ?? 0})
          )
        INSERT INTO workout_exercises (workout_id, exercise_id, "order", priority)
          SELECT workout_id, exercise_id, "order", priority
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
