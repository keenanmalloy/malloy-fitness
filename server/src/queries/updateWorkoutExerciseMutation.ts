import { db } from "config/db";
import Joi from "joi";
import { update } from "utils/update";

interface Response {
  status: string;
  message: string;
  exercise: any;
  error?: any;
}

const updateWorkoutExerciseSchema = Joi.object({
  order: Joi.alternatives(Joi.string(), Joi.number()).optional(),
  priority: Joi.alternatives(Joi.string(), Joi.number()).optional(),
});

export const updateWorkoutExerciseMutation = async (
  res: any,
  data: Record<string, string>,
  workoutId: string,
  exerciseId: string
): Promise<Response> => {
  const { error, value, warning } = updateWorkoutExerciseSchema.validate(data);
  if (error) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data",
      exercise: value,
      error: error,
    });
  } else {
    const { order, priority } = data;

    if (
      (typeof order === "number" && order < 0) ||
      (typeof priority === "number" && priority < 0)
    ) {
      return res.json({
        status: "error",
        message: "Only positive numbers allowed for weight and reps",
        exercise: null,
      });
    }

    if (!order && !priority) {
      return res.status(422).json({
        status: "error",
        message:
          "Both order and priority were missing or were coerced to false. One of order or priority is required to update the exercise within the workout.",
        exercise: null,
      });
    }

    const generateSetClause = () => {
      if (order && !priority) {
        return `"order" = '${order}'`;
      }
      if (priority && !order) {
        return `priority = '${priority}'`;
      }

      return `
        "order" = '${order}'
        priority = '${priority}'
      `;
    };

    const query = `
        UPDATE workout_exercises
        SET 
            ${generateSetClause()}
        WHERE 
            workout_id = $1 AND exercise_id = $2
    `;
    const params = [workoutId, exerciseId];

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.json({
          status: "error",
          message: "Exercise does not exist",
          exercise: null,
        });
      }

      return res.json({
        status: "success",
        message: "Exercise updated successfully",
        exercise: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: "error",
        message: "Database error",
        exercise: null,
      });
    }
  }
};
