import { db } from "config/db";
import { Request, Response } from "express";
import { isValidDate } from "time";

export const retrieveWorkoutsQuery = async (req: Request, res: Response) => {
  const dateQuery = req.query.date as string | undefined;
  const categoryQuery = req.query.category as string | undefined;
  const completedQuery = req.query.completed as string | undefined;

  const accountId = res.locals.state.account.account_id;
  const query = `
  SELECT * FROM workouts 
  WHERE created_by = ${accountId} 
  ${generateDateFilter(dateQuery)} 
  ${generateCategoryFilter(categoryQuery)}
  ${generateCompletedFilter(completedQuery)}
  LIMIT 20`;

  try {
    const data = await db.query(query);

    return res.status(200).json({
      message: "Workouts fetched successfully",
      status: "success",
      workouts: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: "error",
      message: "Database error",
      workouts: null,
    });
  }
};

const generateDateFilter = (
  query: "today" | "yesterday" | "tomorrow" | string | undefined
) => {
  if (query === "today") {
    const today = new Date();
    const todayDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(today);
    return `AND Date(workout_dt) = '${todayDate}'`;
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
    return `AND Date(workout_dt) = '${yesterdayDate}'`;
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

    return `AND Date(workout_dt) = '${tmrwDate}'`;
  }

  if (!!query) {
    if (isValidDate(query)) {
      return `AND Date(workout_dt) = '${query}'`;
    }

    console.log(
      'ERROR: invalid date passed to /workouts?d="invalid-date-passed". Returning all workouts instead. '
    );
    return ``;
  }

  return ``;
};

const generateCategoryFilter = (categoryQuery: string | undefined) => {
  if (!!categoryQuery) {
    return `AND category LIKE '%${categoryQuery}%'`;
  }

  return ``;
};

const generateCompletedFilter = (completedQuery: string | undefined) => {
  if (!!completedQuery) {
    return `AND completed = '${Boolean(completedQuery)}'`;
  }

  return ``;
};
