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

const retrieveExercisesByMgIds = async (req: Request, res: Response) => {
  const query = `
  WITH
    exercises AS (
        SELECT * FROM exercises
        WHERE created_by = $1 OR view = 'public'
        LIMIT 5
    )

  SELECT
      e.name,
      e.exercise_id,
      e.profile,
      e.category,
      e.description
  FROM exercises e
      LEFT OUTER JOIN exercise_muscle_groups emg
            on emg.exercise_id = e.exercise_id
              LEFT OUTER JOIN muscle_groups mg on mg.muscle_group_id = emg.muscle_group_id
                WHERE mg.muscle_group_id IN (${req.query.mgIds})`;

  const accountId = res.locals.state.account.account_id;
  const params = [accountId];
  const data = await db.query(query, params);

  return getUniqueListBy(data.rows, 'exercise_id');
};
