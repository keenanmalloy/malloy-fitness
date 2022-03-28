import { db } from "config/db";
import { Response } from "express";

export const startWorkoutMutation = async (res: Response, id: string) => {
  const query = `
    UPDATE workouts
    SET started_at = $1, workout_dt = $1
    WHERE workout_id = $2 AND created_by = $3
    RETURNING *;
  `;

  const startedAt = new Date();
  const accountId = res.locals.state.account.account_id;
  const params = [startedAt, id, accountId];

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
      message: "Workout updated successfully",
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