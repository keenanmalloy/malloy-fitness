import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  set: any;
  error?: any;
}

export const deleteSetsByExerciseMutation = async (
  res: any,
  workoutId: string,
  exerciseId: string
): Promise<Response> => {
  const query = `DELETE FROM sets WHERE workout_id = $1 AND exercise_id = $2 RETURNING *;`;
  const params = [workoutId, exerciseId];

  try {
    const data = await db.query(query, params);

    if (!data.rowCount) {
      return res.status(404).json({
        status: "error",
        message: "Sets do not exist",
        set: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Sets deleted successfully",
      sets: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: "error",
      message: "Database error",
      set: null,
    });
  }
};
