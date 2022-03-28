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
  weight: Joi.number().optional(),
  repetitions: Joi.number().optional(),
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
      return res.status(422).json({
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
        return res.status(404).json({
          status: "error",
          message: "Set does not exist",
          set: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Set updated successfully",
        set: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        status: "error",
        message: "Database error",
        set: null,
      });
    }
  }
};
