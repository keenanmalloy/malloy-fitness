import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  muscleGroups: any;
}

export const retrieveMuscleGroupsQuery = async (
  res: any
): Promise<Response> => {
  const query = `SELECT * FROM muscle_groups`;

  try {
    const data = await db.query(query);

    return res.status(200).json({
      message: "Muscle groups fetched successfully",
      status: "success",
      muscleGroups: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: "error",
      message: "Database error",
      muscleGroups: null,
    });
  }
};
