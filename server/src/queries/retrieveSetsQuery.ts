import { db } from "config/db";

interface Response {
  status: string;
  message: string;
  sets: any;
}

export const retrieveSetsQuery = async (
  res: any,
  workoutId: any
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const query = `SELECT * FROM sets LEFT JOIN workouts ON workouts.workout_id = sets.workout_id WHERE workouts.workout_id = $1 AND workouts.created_by = $2`;
  const params = [workoutId, accountId];

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
