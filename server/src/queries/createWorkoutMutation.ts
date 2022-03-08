import { db } from "config/db";
import Joi from "joi";

interface createWorkout {
  name: string;
  description: string;
  category: string;
  created_by: string | number;
  exercises: string[] | number[];
}

interface Response {
  status: string;
  message: string;
  workout: any;
  error?: any;
}

const createWorkoutSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  description: Joi.string().max(250).allow("").optional(),
  category: Joi.string().required(),
  exercises: Joi.array().items(Joi.string(), Joi.number()).required(), // array of ids
});

const createWorkoutExercisesLink = async (
  workoutId: string,
  exercises: string[] | number[]
) => {
  const preparePrimaryValues = () => {
    return exercises.map((id) => `(${workoutId}, ${id})`).join(",");
  };

  const data = await db.query(`
    WITH     
    data(workout_id, exercise_id) AS (
      VALUES 
        ${preparePrimaryValues()}
      )
    INSERT INTO workout_exercises (workout_id, exercise_id)
      SELECT workout_id, exercise_id
        FROM data
      RETURNING *
    `);

  return data.rows;
};

export const createWorkoutMutation = async (
  res: any,
  data: createWorkout
): Promise<Response> => {
  if (!data.exercises) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data, missing array of exercise id(s)",
      workout: null,
      example: {
        name: "My Workout",
        description: "",
        category: "Legs",
        exercises: [1, 2, 3],
      },
    });
  }

  const { error, value, warning } = createWorkoutSchema.validate(data);

  if (error) {
    return res.status(422).json({
      status: "error",
      message: "Invalid request data",
      workout: value,
      error: error,
    });
  } else {
    const { name, description, category, exercises } = data;

    const query = `
      WITH 
        data(name, description, category) AS (
          VALUES                           
              ('${name}', '${description}', '${category}')
          )
        INSERT INTO workouts (name, description, category)
          SELECT name, description, category
            FROM data
          RETURNING *
      `;

    try {
      const data = await db.query(query);
      const workoutId = data.rows[0].workout_id;

      await createWorkoutExercisesLink(workoutId, exercises);
      const workout = data.rows[0];

      return res.json({
        status: "success",
        message: "Workout created successfully",
        workout,
      });
    } catch (error) {
      return res.json({
        status: "error",
        //@ts-ignore
        message: error && error.message ? error.message : "Database error",
        workout: null,
      });
    }
  }
};
