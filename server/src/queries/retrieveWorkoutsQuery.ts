import { db } from 'config/db';
import { Request, Response } from 'express';
import { isValidDate } from 'time';

export const retrieveWorkoutsQuery = async (req: Request, res: Response) => {
  const dateQuery = req.query.date as string | undefined;
  const categoryQuery = req.query.category as string | undefined;
  const completedQuery = req.query.completed as string | undefined;
  const typeQuery = req.query.type as string | undefined;
  const activityQuery = req.query.activity as string | undefined;
  const sortByQuery = req.query.sortBy as string | undefined;

  const accountId = res.locals.state.account.account_id;
  const query = `
  SELECT * FROM workouts 
  WHERE created_by = ${accountId} 
  ${generateDateFilter(dateQuery)} 
  ${generateCategoryFilter(categoryQuery)}
  ${generateCompletedFilter(completedQuery)}
  ${generateTypeFilter(typeQuery)}
  ${generateActivityFilter(activityQuery)}
  ${generateSortByFilter(sortByQuery)}
  LIMIT 20`;

  try {
    const data = await db.query(query);

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Workouts fetched successfully',
      status: 'success',
      workouts: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      workouts: null,
    });
  }
};

const generateDateFilter = (
  query: 'today' | 'yesterday' | 'tomorrow' | string | undefined
) => {
  if (query === 'today') {
    const today = new Date();
    const todayDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(today);
    return `AND Date(workout_dt) = '${todayDate}'`;
  }

  if (query === 'yesterday') {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(yesterday);
    return `AND Date(workout_dt) = '${yesterdayDate}'`;
  }

  if (query === 'tomorrow') {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tmrwDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(tomorrow);

    return `AND Date(workout_dt) = '${tmrwDate}'`;
  }

  if (query === 'future') {
    const today = new Date();
    const todayDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(today);
    return `AND Date(workout_dt) >= '${todayDate}'`;
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

const generateTypeFilter = (typeQuery: string | undefined) => {
  if (!!typeQuery) {
    return `AND type = '${typeQuery}'`;
  }

  return ``;
};

type Activity = 'in-progress' | 'completed' | 'scheduled' | 'default';
const generateActivityFilter = (activityQuery: string | undefined) => {
  switch (activityQuery as Activity) {
    case 'in-progress':
      return `AND started_at IS NOT NULL AND ended_at IS NULL`;
    case 'completed':
      return `AND completed = true`;
    case 'scheduled':
      return `AND workout_dt IS NOT NULL AND started_at IS NULL`;
    case 'default':
      return `AND workout_dt IS NULL AND started_at IS NULL`;
    default:
      return ``;
  }
};

// created-asc, created-desc, updated-asc, updated-descm scheduled-asc, scheduled-desc
type SortBy =
  | 'created-asc'
  | 'created-desc'
  | 'updated-asc'
  | 'updated-desc'
  | 'scheduled-asc'
  | 'scheduled-desc'
  | 'started-desc'
  | 'started-asc';
const generateSortByFilter = (sortByQuery: string | undefined) => {
  switch (sortByQuery as SortBy) {
    case 'created-asc':
      return `ORDER BY created_at ASC`;
    case 'created-desc':
      return `ORDER BY created_at DESC`;
    case 'updated-asc':
      return `ORDER BY updated_at ASC`;
    case 'updated-desc':
      return `ORDER BY updated_at DESC`;
    case 'started-asc':
      return `ORDER BY started_at ASC`;
    case 'started-desc':
      return `ORDER BY started_at DESC`;
    case 'scheduled-asc':
      return `ORDER BY workout_dt ASC`;
    case 'scheduled-desc':
      return `ORDER BY workout_dt DESC`;
    default:
      return ``;
  }
};
