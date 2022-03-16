import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  workouts: any;
}

export const retrieveWorkoutsQuery = async (res: any): Promise<Response> => {
  const query = `SELECT * FROM workouts`;

  try {
    const data = await db.query(query);

    return res.json({
      message: "Workouts fetched successfully",
      status: "success",
      workouts: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.json({
      status: "error",
      message: "Database error",
      workouts: null,
    });
  }
};
