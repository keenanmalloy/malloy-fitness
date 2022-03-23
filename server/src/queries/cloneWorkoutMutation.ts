import { db } from "config/db";
import Joi from "joi";

type Exercises = {
  id: string | number;
  priority?: number;
  order?: number;
}[];

interface Response {
  status: string;
  message: string;
  workout: any;
  error?: any;
}

const cloneWorkoutSchema = Joi.object({
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

const cloneWorkoutExercisesLink = async (
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

export const cloneWorkoutMutation = async (res: any, workoutId: string) => {
  try {
    const workout = await retrieveWorkoutQuery(workoutId);
    if (!workout) {
      return res.status(404).json({
        message: "Failed",
        error: "Workout failed to fetch, does it exist?",
      });
    }

    // @@ TODO fix account_id
    const accountId = "1";

    const workoutQuery = `
      WITH
        workoutdata(name, description, category, created_by) AS (
          VALUES
              ('${workout.name}', '${workout.description}', '${workout.category}', ${accountId})
          )
        INSERT INTO workouts (name, description, category, created_by)
          SELECT *
            FROM workoutdata
          RETURNING *
      `;

    const data = await db.query(workoutQuery);
    const createdWorkoutId = data.rows[0].workout_id;

    const generateWeValues = () => {
      return workout.workoutExercises
        .map(
          (we) =>
            `(${createdWorkoutId}, ${we.exerciseId}, ${we.priority}, ${we.order})`
        )
        .join(",");
    };

    if (!workout.workoutExercises.length) {
      return res.json({ message: "Workout Successfully Cloned" });
    }

    const weQuery = `
        WITH
          wedata(workout_id, exercise_id, priority, "order") AS (
              VALUES 
                ${generateWeValues()}
            )
          INSERT INTO workout_exercises (workout_id, exercise_id, priority, "order")
            SELECT workout_id, exercise_id, priority, "order"
              FROM wedata
            RETURNING *
      `;

    await db.query(weQuery);

    return res.json({ message: "Workout Successfully Cloned" });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: "Failed",
      error: "Workout failed to clone",
    });
  }
};

const retrieveWorkoutQuery = async (workoutId: string) => {
  const query = `SELECT 
  workouts.name as name,
  workouts.description as description,
  workouts.category as category,
  workouts.workout_id,
  we.priority,
  we.order,
  we.exercise_id
FROM workouts
LEFT OUTER JOIN workout_exercises we on workouts.workout_id = we.workout_id
WHERE workouts.workout_id = $1`;
  const params = [workoutId];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return null;
    }

    // Because of the LEFT OUTER JOIN, we return a single exercise with a null id.
    // Check if it exists and return an empty array if it does not.
    const workoutExercises = !data.rows[0].exercise_id
      ? []
      : data.rows.map((we) => {
          return {
            exerciseId: we.exercise_id,
            order: we.order,
            priority: we.priority,
          };
        });

    const workout = {
      name: data.rows[0].name,
      description: data.rows[0].description,
      category: data.rows[0].category,
      workout_id: data.rows[0].workout_id,
      workoutExercises,
    };

    return workout;
  } catch (error) {
    console.log({ error });
    return null;
  }
};
