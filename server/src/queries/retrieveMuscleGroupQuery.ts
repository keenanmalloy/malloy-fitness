import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  muscleGroup: any;
}

export const retrieveMuscleGroupQuery = async (
  res: any,
  id: string
): Promise<Response> => {
  const query = `SELECT * FROM muscle_groups WHERE muscle_group_id = $1`;
  const params = [id];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return res.json({
        status: "error",
        message: "Muscle Group does not exist",
        muscleGroup: null,
      });
    }

    const muscleGroup = data.rows[0];

    return res.json({
      status: "success",
      message: "Muscle group fetched successfully",
      muscleGroup,
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