import { db } from "config/db";
import { Response } from "express";

export const retrieveWorkoutsQuery = async (res: Response): Promise<any> => {
  const accountId = res.locals.state.account.account_id;
  const query = `SELECT * FROM workouts WHERE created_by = ${accountId}`

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
