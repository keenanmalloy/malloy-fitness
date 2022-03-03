import { db } from "config/db";
import Joi from "joi";

interface createExercise {
  name: string;
  description: string;
  category: string;
  primary: string;
  secondary: string;
  image: string;
  video: string;
  movement: string;
}

interface Response {
  status: string;
  message: string;
  exercise: any;
  error?: any
}

const createExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  description: Joi.string().max(250).allow("").optional(),
  category: Joi.string().required(),
  primary: Joi.string().required(),
  secondary: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional(),
  video: Joi.string().allow("").optional(),
  movement: Joi.string().valid("isolation", "compound").required(),
});

export const createExerciseMutation = async (
  res: any,
  data: createExercise
): Promise<Response> => {
  const { error, value, warning } = createExerciseSchema.validate(data);
  if (error) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data",
      exercise: value,
      error: error,
    });
  } else {
    const {
      name,
      description,
      category,
      primary,
      secondary,
      image,
      video,
      movement,
    } = data;

    const query = `INSERT INTO "exercises" (name, description, category, "primary", secondary, image, video, movement) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING RETURNING *`;
    const params = [
      name,
      description,
      category,
      primary,
      secondary,
      image,
      video,
      movement,
    ];

    try {
      const data = await db.query(query, params);

      return res.json({
        status: "success",
        message: "Exercise created successfully",
        exercise: data.rows[0],
      });
    } catch (error) {
      console.log({ error });
      return res.json({
        status: "error",
        message: "Database error",
        exercise: null,
      });
    }
  }
};
