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
  const query = `SELECT * FROM workouts WHERE workout_id = $1`;
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

    const workout = data.rows[0];

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
      exercise: null,
    });
  }
};
