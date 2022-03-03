import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  exercises: any;
}

export const retrieveExercisesQuery = async (res: any): Promise<Response> => {
  const query = `SELECT * FROM exercises`;

  try {
    const data = await db.query(query);

    return res.json({
      message: "Exercises fetched successfully",
      status: "success",
      exercises: data.rows,
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
