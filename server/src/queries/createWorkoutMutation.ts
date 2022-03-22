import { db } from "config/db";
import Joi from "joi";

type Exercises = {
  id: string | number;
  priority?: number;
  order?: number;
}[];

interface createWorkout {
  name: string;
  description: string;
  category: string;
  created_by: string | number;
  exercises: Exercises;
}

interface Response {
  status: string;
  message: string;
  workout: any;
  error?: any;
}

const createWorkoutSchema = Joi.object({
  name: Joi.string().min(3).max(64).required(),
  description: Joi.string().max(250).allow("").optional(),
  category: Joi.string().required(),
  exercises: Joi.array()
    .items(
      Joi.object().keys({
        id: Joi.any().required(),
        order: Joi.number().optional(),
        priority: Joi.number().optional(),
      })
    )
    .required(),
});

const createWorkoutExercisesLink = async (
  workoutId: string,
  exercises: Exercises
) => {
  const preparePrimaryValues = () => {
    return exercises
      .map((exercise) => {
        return `(${workoutId}, ${exercise.id}, ${exercise.order ?? 0}, ${
          exercise.priority ?? 0
        })`;
      })
      .join(",");
  };

  const data = await db.query(`
    WITH     
    data(workout_id, exercise_id, "order", priority) AS (
      VALUES 
        ${preparePrimaryValues()}
      )
    INSERT INTO workout_exercises (workout_id, exercise_id, "order", priority)
      SELECT workout_id, exercise_id, "order", priority
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
      message: `Invalid request data, missing array of objects of id, order and priority. 
        Order is used so we can sort the exercises. 
        Priority is used to prioritize exercises placed at the same order.`,
      workout: null,
      example: {
        name: "My Workout",
        description: "",
        category: "Legs",
        exercises: [
          { id: 1, order: 1 },
          { id: 2, order: 2 },
          { id: 3, order: 3, priority: 1 },
          { id: 4, order: 3, priority: 2 },
          { id: 5, order: 3, priority: 3 },
        ],
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
    const accountId = res.locals.state.account.account_id;

    const query = `
      WITH 
        data(name, description, category, created_by) AS (
          VALUES                           
              ('${name}', '${description}', '${category}', ${accountId})
          )
        INSERT INTO workouts (name, description, category, created_by)
          SELECT name, description, category, created_by
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
        error: error,
      });
    }
  }
};
