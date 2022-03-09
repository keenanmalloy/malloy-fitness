import { db } from "config/db";
import Joi from "joi";

interface createSet {
  workout_id: string | number;
  exercise_id: string | number;
  repetitions?: number;
  weight?: number;
}

interface Response {
  status: string;
  message: string;
  set: any;
  error?: any;
}

const createSetSchema = Joi.object({
  exercise_id: Joi.number().required(),
  repetitions: Joi.number().optional(),
  weight: Joi.number().optional(),
});

export const createSetMutation = async (
  res: any,
  data: createSet,
  workoutId: any
): Promise<Response> => {
  const { error, value, warning } = createSetSchema.validate(data);

  if (error) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data",
      set: value,
      error: error,
    });
  } else {
    const { exercise_id, repetitions, weight } = data;

    if (
      (typeof repetitions === "number" && repetitions < 0) ||
      (typeof weight === "number" && weight < 0)
    ) {
      return res.json({
        status: "error",
        message: "Only positive numbers allowed for weight and reps",
        set: null,
      });
    }

    const query = `
      WITH 
        data(exercise_id, repetitions, weight, workout_id) AS (
          VALUES                           
              (${exercise_id}, ${repetitions ?? 0}, ${
      weight ?? 0
    }, ${workoutId})
          )
        INSERT INTO sets (exercise_id, repetitions, weight, workout_id)
          SELECT exercise_id, repetitions, weight, workout_id
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);
      const set = data.rows[0];

      return res.json({
        status: "success",
        message: "Set created successfully",
        set,
      });
    } catch (error) {
      return res.json({
        status: "error",
        //@ts-ignore
        message: error && error.message ? error.message : "Database error",
        set: null,
      });
    }
  }
};
