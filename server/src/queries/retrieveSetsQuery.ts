import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  sets: any;
}

export const retrieveSetsQuery = async (res: any, workoutId: any): Promise<Response> => {
  const query = `SELECT * FROM sets WHERE workout_id = $1`;
  const params = [workoutId]

  try {
    const data = await db.query(query, params);

    return res.json({
      message: "Sets fetched successfully",
      status: "success",
      sets: data.rows,
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
