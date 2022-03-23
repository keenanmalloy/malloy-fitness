import { db } from "config/db";
import Joi from "joi";

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
  order: Joi.string().optional(),
  priority: Joi.string().optional(),
});

export const addExerciseToWorkoutMutation = async (
  res: any,
  data: addExercise,
  workoutId: string
): Promise<Response> => {
  const { error, value, warning } = addExerciseSchema.validate(data);

  if (error) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data",
      exercise: value,
      error: error,
    });
  } else {
    const { order, priority, exerciseId } = data;

    const query = `
      WITH 
        data(workoutId, exerciseId, "order", priority) AS (
          VALUES                           
              ('${workoutId}', '${exerciseId}', '${order ?? 0}','${
      priority ?? 0
    }')
          )
        INSERT INTO exercises (workoutId, exerciseId, "order", priority)
          SELECT workoutId, exerciseId, "order", priority
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);
      const exercise = data.rows[0];

      return res.json({
        status: "success",
        message: "Exercise added successfully",
        exercise,
      });
    } catch (error) {
      console.log({ error });
      return res.json({
        status: "error",
        //@ts-ignore
        message: error && error.message ? error.message : "Database error",
        exercise: null,
      });
    }
  }
};