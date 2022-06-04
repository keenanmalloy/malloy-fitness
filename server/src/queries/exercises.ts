import { db } from 'config/db';
import { exercises_table } from 'utils/databaseTypes';
import { getMuscleGroups } from './muscle-groups';

interface getExerciseWithMuscleGroupsParams {
  exerciseId: string;
  accountId: string;
}

export const getExerciseWithMuscleGroups = async ({
  exerciseId,
  accountId,
}: getExerciseWithMuscleGroupsParams) => {
  const query = `SELECT * FROM exercises WHERE exercise_id = $1 AND (created_by = $2 OR view = 'public')`;
  const params = [exerciseId, accountId];
  const data = await db.query<Required<exercises_table>>(query, params);

  if (!data.rows.length) throw new Error('Exercise not found');
  const muscleGroups = await getMuscleGroups(exerciseId);

  const exercise = {
    ...data.rows[0],
    primary: muscleGroups
      .filter((mg) => mg.group === 'primary')
      .map((mg) => {
        return {
          name: mg.name,
          description: mg.description,
          muscle_group_id: mg.muscle_group_id,
          group: mg.group,
        };
      }),
    secondary: muscleGroups
      .filter((mg) => mg.group === 'secondary')
      .map((mg) => {
        return {
          name: mg.name,
          description: mg.description,
          muscle_group_id: mg.muscle_group_id,
          group: mg.group,
        };
      }),
  };

  return exercise;
};

export const getRelatedExercises = async (data: QueryGeneratorParams) => {
  const { query, params } = getQueryFromType(data);
  const relatedExercises = await db.query<
    Required<Pick<exercises_table, 'name' | 'exercise_id'>>
  >(query, params);
  return relatedExercises;
};

export type ExerciseType =
  | 'strength'
  | 'hypertrophy'
  | 'cardio'
  | 'physiotherapy';

interface QueryGeneratorParams {
  type: ExerciseType;
  mgIds: string[];
  categoryQuery: string | null | undefined;
  profileQuery: string | null | undefined;
  exerciseIdQuery: string | null | undefined;
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

interface CreateExerciseParams {
  name: string;
  type: string;
  category: string;
  profile: string;
  description: string;
  createdBy: string;
  primaryTracker: string;
  video: string;
  secondaryTracker: string;
}

export const createExercise = async (payload: CreateExerciseParams) => {
  const {
    name,
    description,
    category,
    profile,
    primaryTracker,
    secondaryTracker,
    type,
    createdBy,
    video,
  } = payload;

  const query = `
    WITH 
      data(name, description, category, profile, created_by, primary_tracker, secondary_tracker, type, video) AS (
        VALUES                           
            (
              '${name}', 
              '${description}', 
              ${!!category ? `'${category}'` : null}, 
              ${!!category ? `'${profile}'` : null}, 
              ${createdBy}, 
              '${primaryTracker}', 
              ${!!secondaryTracker ? `'${secondaryTracker}'` : null},
              '${type}',
              '${video}'
            )
        )
      INSERT INTO exercises (name, description, category, profile, created_by, primary_tracker, secondary_tracker, type, video)
        SELECT name, description, category, profile, created_by, primary_tracker, secondary_tracker, type, video
          FROM data
        RETURNING *
    `;
  const data = await db.query<Required<exercises_table>>(query);
  return data.rows[0];
};
