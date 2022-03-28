import { db } from "config/db";
import Joi from "joi";
import { update } from "utils/update";

interface Response {
  status: string;
  message: string;
  exercise: any;
  error?: any;
}

const updateExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(200).optional(),
  description: Joi.string().max(500).allow("").optional(),
  category: Joi.string().optional(),
  video: Joi.string().allow(null).optional(),
  profile: Joi.string().allow(null).valid("short", "med", "long").optional(),
});

export const updateExerciseMutation = async (
  res: any,
  data: Record<string, string>,
  id: string
): Promise<Response> => {
  const { error, value, warning } = updateExerciseSchema.validate(data);
  if (error) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data",
      exercise: value,
      error: error,
    });
  } else {
    const { query, params } = update({
      tableName: "exercises",
      conditions: {
        exercise_id: id,
      },
      data,
    });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.status(404).json({
          status: "error",
          message: "Exercise does not exist",
          exercise: null,
        });
      }

      return res.status(200).json({
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
