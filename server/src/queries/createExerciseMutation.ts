import { db } from "config/db";
import Joi from "joi";

interface createExercise {
  name: string;
  description: string;
  category: string;
  primary: string[];
  secondary: string[];
  image: string;
  video: string;
  movement: string;
}

interface Response {
  status: string;
  message: string;
  exercise: any;
  error?: any;
}

const createExerciseSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  description: Joi.string().max(250).allow("").optional(),
  category: Joi.string().required(),
  primary: Joi.array().items(Joi.string()).required(),
  secondary: Joi.array().items(Joi.string()).optional(),
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
      primary, // array of ids
      secondary, // array of ids
      image,
      video,
      movement,
    } = data;

    const preparePrimaryValues = () => {
      if (secondary.length) {
        return `${primary
          .map((id) => `(SELECT ins1.exercise_id FROM ins1), ${id}`)
          .join(",")},`;
      }
      return primary
        .map((id) => `(SELECT ins1.exercise_id FROM ins1), ${id}`)
        .join(",");
    };

    const prepareSecondaryValues = () => {
      return secondary
        .map((id) => `(SELECT ins1.exercise_id FROM ins1), ${id}`)
        .join(",");
    };

    const query = `
      WITH 
      
      data(name, description, category, image, video, movement) AS (
        VALUES                           
            ('${name}', '${description}', '${category}', '${image}', '${video}', '${movement}')
        ), 

      ins1 AS (
        INSERT INTO exercises (name, description, category, image, video, movement)
          SELECT name, description, category, image, video, movement
            FROM data
          RETURNING exercise_id
        ), 

      data2(exercise_id, muscle_group_id) AS (
          VALUES (
            ${preparePrimaryValues()}
            ${prepareSecondaryValues()}
          )
        )
        
      INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id)
        SELECT data2.exercise_id, data2.muscle_group_id
        FROM data2
      `;

    try {
      const data = await db.query(query);

      return res.json({
        status: "success",
        message: "Exercise created successfully",
        exercise: data.rows[0],
      });
    } catch (error) {
      return res.json({
        status: "error",
        //@ts-ignore
        message: error && error.message ? error.message : "Database error",
        exercise: null,
      });
    }
  }
};
