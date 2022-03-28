import { db } from "config/db";
import { Request, Response } from "express";
import { isValidDate } from "time";

export const retrieveWorkoutsQuery = async (req: Request, res: Response) => {
  const dateQuery = req.query.d as string | undefined;

  const accountId = res.locals.state.account.account_id;
  const query = generateFilter(dateQuery, accountId);

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

const generateFilter = (
  query: "today" | "yesterday" | "tomorrow" | string | undefined,
  accountId: string
) => {
  if (query === "today") {
    const today = new Date();
    const todayDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(today);
    return `SELECT * FROM workouts WHERE created_by = ${accountId} AND Date(workout_dt) = '${todayDate}'`;
  }

  if (query === "yesterday") {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(yesterday);
    return `SELECT * FROM workouts WHERE created_by = ${accountId} AND Date(workout_dt) = '${yesterdayDate}'`;
  }

  if (query === "tomorrow") {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tmrwDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(tomorrow);

    return `SELECT * FROM workouts WHERE created_by = ${accountId} AND Date(workout_dt) = '${tmrwDate}'`;
  }

  // This means we've passed a datetime object.
  if (!!query) {
    if (isValidDate(query)) {
      return `SELECT * FROM workouts WHERE created_by = ${accountId} AND Date(workout_dt) = '${query}'`;
    }

    // Default to return all the workouts if error.
    console.log(
      'ERROR: invalid date passed to /workouts?d="invalid-date-passed". Returning all workouts instead. '
    );
    return `SELECT * FROM workouts WHERE created_by = ${accountId}`;
  }

  // Default to return all the workouts regardless of time.
  return `SELECT * FROM workouts WHERE created_by = ${accountId}`;
};
