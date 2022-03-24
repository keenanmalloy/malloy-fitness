import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  workout: any;
  error?: any;
}

export const deleteWorkoutMutation = async (
  res: any,
  id: string
): Promise<Response> => {
  const query = `DELETE FROM workouts WHERE workout_id = $1 RETURNING *;`;
  const params = [id];

  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.status(404).json({
        status: "error",
        message: "Workout does not exist",
        workout: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Workout deleted successfully",
      workout: data.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: "error",
      message: "Database error",
      workout: null,
    });
  }
};
