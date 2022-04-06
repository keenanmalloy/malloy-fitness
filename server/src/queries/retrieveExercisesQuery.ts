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

export const retrieveExercisesQuery = async (req: Request, res: Response) => {
  const query = !!req.query.q
    ? `
    WITH
    exercises AS (
        SELECT * FROM exercises
        WHERE created_by = $1 OR view = 'public'
        LIMIT 10
    )

    SELECT
        e.name,
        e.exercise_id,
        e.profile,
        e.category,
        e.created_by,
        e.description,
        e.view,
        mg.muscle_group_id,
        mg.name AS muscle_group_name,
        mg.description AS muscle_group_description,
        "group" AS muscle_group

    FROM exercises e
        LEFT OUTER JOIN exercise_muscle_groups emg
              on emg.exercise_id = e.exercise_id
                LEFT OUTER JOIN muscle_groups mg on mg.muscle_group_id = emg.muscle_group_id
    
    WHERE 
      e.name LIKE '%${req.query.q}%' 
      OR e.description LIKE '%${req.query.q}%' 
      OR mg.name LIKE '%${req.query.q}%' 
      OR mg.description LIKE '%${req.query.q}%'
`
    : `
    WITH
    exercises AS (
        SELECT * FROM exercises
        WHERE created_by = $1 OR view = 'public'
        LIMIT 10
    )

    SELECT
        e.name,
        e.exercise_id,
        e.profile,
        e.category,
        e.created_by,
        e.description,
        e.view,
        mg.muscle_group_id,
        mg.name AS muscle_group_name,
        mg.description AS muscle_group_description,
        "group" AS muscle_group

    FROM exercises e
        LEFT OUTER JOIN exercise_muscle_groups emg
              on emg.exercise_id = e.exercise_id
                LEFT OUTER JOIN muscle_groups mg on mg.muscle_group_id = emg.muscle_group_id`;

  const accountId = res.locals.state.account.account_id;
  const params = [accountId];

  try {
    const data = await db.query(query, params);
    const exercises = getUniqueListBy(
      data.rows.map(
        ({
          name,
          exercise_id,
          profile,
          category,
          created_by,
          description,
          view,
        }) => {
          return {
            name,
            exercise_id,
            profile,
            category,
            created_by,
            description,
            view,
            primary: data.rows
              .filter(
                (e) =>
                  e.exercise_id === exercise_id && e.muscle_group === 'primary'
              )
              .map((mg) => {
                return {
                  name: mg.muscle_group_name,
                  description: mg.muscle_group_description,
                  muscle_group_id: mg.muscle_group_id,
                  group: mg.muscle_group,
                };
              }),
            secondary: data.rows
              .filter(
                (e) =>
                  e.exercise_id === exercise_id &&
                  e.muscle_group === 'secondary'
              )
              .map((mg) => {
                return {
                  name: mg.muscle_group_name,
                  description: mg.muscle_group_description,
                  muscle_group_id: mg.muscle_group_id,
                  group: mg.muscle_group,
                };
              }),
          };
        }
      ),
      'exercise_id'
    );

    return res.status(200).json({
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
