import { db } from 'config/db';

export const getRelatedExercises = async (data: QueryGeneratorParams) => {
  const { query, params } = getQueryFromType(data);
  const relatedExercises = await db.query(query, params);
  return relatedExercises;
};

type ExerciseType = 'strength' | 'hypertrophy' | 'cardio' | 'physiotherapy';

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
