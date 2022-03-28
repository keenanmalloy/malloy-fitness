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
<<<<<<< HEAD
  exerciseId: Joi.any().optional(),
  order: Joi.any().optional(),
  priority: Joi.any().optional(),
=======
  order: Joi.alternatives(Joi.string(), Joi.number()).optional(),
  priority: Joi.alternatives(Joi.string(), Joi.number()).optional(),
  exerciseId: Joi.alternatives(Joi.string(), Joi.number()).required(),
>>>>>>> 97a5acf42fb5f8ab9bf35e01dbac644a0dd1886c
});

export const addExerciseToWorkoutMutation = async (
  res: any,
  data: addExercise,
  workoutId: string
): Promise<Response> => {
  const { error, value, warning } = addExerciseSchema.validate(data);

  if (error) {
    return res.status(422).json({
      status: 'error',
      message: 'Invalid request data',
      exercise: value,
      error: error,
    });
  } else {
    const { order, priority, exerciseId } = data;

    if (Number.isNaN(parseInt(exerciseId.toString()))) {
      return res.status(422).json({
        status: "error",
        //@ts-ignore
        message: "Invalid exercise ID",
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

<<<<<<< HEAD
      return res.json({
        status: 'success',
        message: 'Exercise added successfully',
=======
      return res.status(201).json({
        status: "success",
        message: "Exercise added successfully",
>>>>>>> 97a5acf42fb5f8ab9bf35e01dbac644a0dd1886c
        exercise,
      });
    } catch (error) {
      console.log({ error });
<<<<<<< HEAD
      return res.json({
        status: 'error',
=======
      return res.status(500).json({
        status: "error",
>>>>>>> 97a5acf42fb5f8ab9bf35e01dbac644a0dd1886c
        //@ts-ignore
        message: error && error.message ? error.message : 'Database error',
        exercise: null,
      });
    }
  }
};
