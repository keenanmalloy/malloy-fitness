import { db } from 'config/db';
import { Response, Request } from 'express';

// https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
function getUniqueListBy(arr: any, key: string) {
  return [
    ...new Map(
      arr.map((item: { [x: string]: any }) => [item[key], item])
    ).values(),
  ];
}

export const retrieveExercisesByMuscleGroupQuery = async (
  req: Request,
  res: Response
) => {
  try {
    const exercises = await retrieveExercisesByMgIds(req, res);
    return res.status(200).json({
      role: res.locals.state.account.role,
      message: 'Exercises fetched successfully',
      status: 'success',
      exercises,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      exercises: null,
    });
  }
};

type ExerciseType = 'strength' | 'hypertrophy' | 'cardio' | 'physiotherapy';

const retrieveExercisesByMgIds = async (req: Request, res: Response) => {
  const typeQuery = req.query.type as ExerciseType;
  const categoryQuery = req.query.category as string;
  const profileQuery = req.query.profile as string;
  const exerciseIdQuery = req.query.exerciseId as string;
  const accountId = res.locals.state.account.account_id;

  const { query, params } = getQueryFromType({
    type: typeQuery,
    mgIds: req.query.mgIds as string[],
    categoryQuery,
    profileQuery,
    exerciseIdQuery,
    accountId,
  });

  const data = await db.query(query, params);

  return getUniqueListBy(data.rows, 'exercise_id');
};

interface QueryGeneratorParams {
  type: ExerciseType;
  mgIds: string[];
  categoryQuery: string;
  profileQuery: string;
  exerciseIdQuery: string;
  accountId: string;
}

const getQueryFromType = ({
  type,
  mgIds,
  categoryQuery,
  profileQuery,
  exerciseIdQuery,
  accountId,
}: QueryGeneratorParams) => {
  let query = '';
  let params;

  if (type === 'strength') {
    query = `
      WITH
        exercises AS (
            SELECT * FROM exercises
            WHERE (created_by = $1 OR view = 'public') 
              AND type IN('strength', 'hypertrophy')
              AND category = $2
              AND profile = $3
              AND exercise_id != $4
        )

      SELECT
          e.name,
          e.exercise_id
      FROM exercises e
          LEFT OUTER JOIN exercise_muscle_groups emg
                on emg.exercise_id = e.exercise_id
                  LEFT OUTER JOIN muscle_groups mg on mg.muscle_group_id = emg.muscle_group_id
                    WHERE mg.muscle_group_id IN (${mgIds})`;

    params = [accountId, categoryQuery, profileQuery, exerciseIdQuery];
  }

  if (type === 'hypertrophy') {
    query = `
      WITH
        exercises AS (
            SELECT * FROM exercises
            WHERE (created_by = $1 OR view = 'public') 
              AND type IN('strength', 'hypertrophy') 
              AND category = $2 
              AND profile = $3
              AND exercise_id != $4
        )
        
      SELECT
          e.name,
          e.exercise_id
      FROM exercises e
          LEFT OUTER JOIN exercise_muscle_groups emg
                on emg.exercise_id = e.exercise_id
                  LEFT OUTER JOIN muscle_groups mg on mg.muscle_group_id = emg.muscle_group_id
                    WHERE mg.muscle_group_id IN (${mgIds})`;

    params = [accountId, categoryQuery, profileQuery, exerciseIdQuery];
  }
  if (type === 'cardio') {
    query = `
      WITH
        exercises AS (
            SELECT * FROM exercises
            WHERE (created_by = $1 OR view = 'public') 
              AND type = 'cardio' 
              AND exercise_id != $2
        )
        
      SELECT
          e.name,
          e.exercise_id
      FROM exercises e
          LEFT OUTER JOIN exercise_muscle_groups emg
                on emg.exercise_id = e.exercise_id
                  LEFT OUTER JOIN muscle_groups mg on mg.muscle_group_id = emg.muscle_group_id
                    WHERE mg.muscle_group_id IN (${mgIds})`;

    params = [accountId, exerciseIdQuery];
  }

  if (type === 'physiotherapy') {
    query = `
        WITH
          exercises AS (
              SELECT * FROM exercises
              WHERE (created_by = $1 OR view = 'public') 
                AND type = 'physiotherapy' 
                AND exercise_id != $2
          )
          
        SELECT
            e.name,
            e.exercise_id
        FROM exercises e
            LEFT OUTER JOIN exercise_muscle_groups emg
                  on emg.exercise_id = e.exercise_id
                    LEFT OUTER JOIN muscle_groups mg on mg.muscle_group_id = emg.muscle_group_id
                      WHERE mg.muscle_group_id IN (${mgIds})`;

    params = [accountId, exerciseIdQuery];
  }

  if (!query) {
    throw new Error('Invalid query type');
  }

  return { query, params };
};
