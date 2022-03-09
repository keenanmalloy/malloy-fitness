import { db } from "config/db";
import Joi from "joi";
import { update } from "utils/update";

interface Response {
  status: string;
  message: string;
  set: any;
  error?: any;
}

const updateSetSchema = Joi.object({
  weight: Joi.number(),
  repetitions: Joi.number(),
});

export const updateSetMutation = async (
  res: any,
  data: Record<string, string>,
  id: string
): Promise<Response> => {
  const { error, value, warning } = updateSetSchema.validate(data);
  if (error) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data",
      set: value,
      error: error,
    });
  } else {
    const { repetitions, weight } = data;

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

    const { query, params } = update({
      tableName: "sets",
      conditions: {
        set_id: id,
      },
      data,
    });

    try {
      const data = await db.query(query, params);
      if (!data.rowCount) {
        return res.json({
          status: "error",
          message: "Set does not exist",
          set: null,
        });
      }

      return res.json({
        status: "success",
        message: "Set updated successfully",
        set: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.json({
        status: "error",
        message: "Database error",
        set: null,
      });
    }
  }
};
