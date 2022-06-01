import { db } from 'config/db';
import { Request, Response } from 'express';
import { sessions_table } from 'utils/databaseTypes';
import { isValidDate } from 'utils/time';

export const retrieveSessionsQuery = async (req: Request, res: Response) => {
  const dateQuery = req.query.date as string | undefined;
  const completedQuery = req.query.completed as string | undefined;
  const typeQuery = req.query.type as string | undefined;
  const activityQuery = req.query.activity as string | undefined;
  const sortByQuery = req.query.sortBy as string | undefined;

  const accountId = res.locals.state.account.account_id;
  const query = `
  SELECT * FROM sessions 
  WHERE created_by = ${accountId} 
  ${generateDateFilter(dateQuery)} 
  ${generateCompletedFilter(completedQuery)}
  ${generateTypeFilter(typeQuery)}
  ${generateActivityFilter(activityQuery)}
  ${generateSortByFilter(sortByQuery)}
  LIMIT 50`;

  try {
    const data = await db.query<sessions_table>(query);

    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Sessions fetched successfully',
      status: 'success',
      sessions: data.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      sessions: null,
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
    return `AND Date(session_dt) = '${todayDate}'`;
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
    return `AND Date(session_dt) = '${yesterdayDate}'`;
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

    return `AND Date(session_dt) = '${tmrwDate}'`;
  }

  if (query === 'future') {
    const today = new Date();
    const todayDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(today);
    return `AND Date(session_dt) >= '${todayDate}'`;
  }

  if (!!query) {
    if (isValidDate(query)) {
      return `AND Date(session_dt) = '${query}'`;
    }

    console.log(
      'ERROR: invalid date passed to /sessions?d="invalid-date-passed". Returning generically ordered sessions instead. '
    );
    return ``;
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
      return `AND session_dt IS NOT NULL AND started_at IS NULL`;
    case 'default':
      return `AND session_dt IS NULL AND started_at IS NULL`;
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
      return `ORDER BY session_dt ASC`;
    case 'scheduled-desc':
      return `ORDER BY session_dt DESC`;
    default:
      return ``;
  }
};
