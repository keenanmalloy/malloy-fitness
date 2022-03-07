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
  primary: Joi.array().items(Joi.string(), Joi.number()).required(),
  secondary: Joi.array().items(Joi.string(), Joi.number()).optional(),
  image: Joi.string().allow("").optional(),
  video: Joi.string().allow("").optional(),
  movement: Joi.string().valid("isolation", "compound").required(),
});

const createExerciseMuscleGroups = async (
  exerciseId: string,
  primary: string[],
  secondary: string[]
) => {
  const preparePrimaryValues = () => {
    if (secondary.length) {
      return `${primary
        .map((id) => `(${exerciseId}, ${id}, 'primary')`)
        .join(",")},`;
    }
    return primary.map((id) => `(${exerciseId}, ${id}, 'primary')`).join(",");
  };

  const prepareSecondaryValues = () => {
    return secondary
      .map((id) => `(${exerciseId}, ${id}, 'secondary')`)
      .join(",");
  };

  const data = await db.query(`
    WITH     
    data(exercise_id, muscle_group_id, "group") AS (
      VALUES 
        ${preparePrimaryValues()}
        ${prepareSecondaryValues()}
      )
    INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, "group")
      SELECT exercise_id, muscle_group_id, "group"
        FROM data
      RETURNING *
    `);

  return data.rows;
};

export const createExerciseMutation = async (
  res: any,
  data: createExercise
): Promise<Response> => {
  const { error, value, warning } = createExerciseSchema.validate(data);

  if (!data.primary.length) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data, missing primary muscle group id(s)",
      exercise: value,
      error: error,
    });
  }

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

    const query = `
      WITH 
      
      data(name, description, category, image, video, movement) AS (
        VALUES                           
            ('${name}', '${description}', '${category}', '${image}', '${video}', '${movement}')
        )
      INSERT INTO exercises (name, description, category, image, video, movement)
        SELECT name, description, category, image, video, movement
          FROM data
        RETURNING *
      `;

    try {
      const data = await db.query(query);
      const exerciseId = data.rows[0].exercise_id;

      const muscleGroups = await createExerciseMuscleGroups(
        exerciseId,
        primary,
        secondary
      );

      const exercise = {
        ...data.rows[0],
        primary: muscleGroups.filter((mg) => mg.group === "primary"),
        secondary: muscleGroups.filter((mg) => mg.group === "secondary"),
      };

      return res.json({
        status: "success",
        message: "Exercise created successfully",
        exercise,
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
