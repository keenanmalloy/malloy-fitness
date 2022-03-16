import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  workout: any;
}

export const retrieveWorkoutQuery = async (
  res: any,
  id: string
): Promise<Response> => {
  const query = `SELECT 
  workouts.name as workout_name,
  workouts.description as workout_description,
  workouts.category as workout_category,
  workouts.created_by as workout_created_by,
  workouts.workout_id,
  e.name,
  e.description,
  e.category,
  e.video,
  e.profile,
  e.exercise_id
FROM workouts
JOIN workout_exercises we on workouts.workout_id = we.workout_id
JOIN exercises e on we.exercise_id = e.exercise_id
WHERE workouts.workout_id = $1`;
  const params = [id];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return res.json({
        status: "error",
        message: "Workout does not exist",
        workout: null,
      });
    }

    const workout = {
      name: data.rows[0].workout_name,
      description: data.rows[0].workout_description,
      category: data.rows[0].workout_category,
      workout_id: data.rows[0].workout_id,
      exercises: data.rows.map((exercise) => {
        return {
          name: exercise.name,
          description: exercise.description,
          exercise_id: exercise.exercise_id,
          category: exercise.category,
          profile: exercise.profile,
          video: exercise.video,
        };
      }),
    };

    return res.json({
      status: "success",
      message: "Workout fetched successfully",
      workout,
    });
  } catch (error) {
    console.log({ error });
    return res.json({
      status: "error",
      message: "Database error",
      workout: null,
    });
  }
};
