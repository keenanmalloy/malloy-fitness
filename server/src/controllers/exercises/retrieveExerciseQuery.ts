import { db } from 'config/db';

interface Response {
  status: string;
  message: string;
  exercise: any;
}

const getMuscleGroups = async (exerciseId: string) => {
  const data = await db.query(
    `SELECT
      mg.name as muscle_group_name,
      mg.description as muscle_group_description,
      mg.muscle_group_id,
      "group" as muscle_group
    FROM muscle_groups mg
    JOIN exercise_muscle_groups emg ON emg.muscle_group_id = mg.muscle_group_id
  WHERE exercise_id = $1`,
    [exerciseId]
  );

  return data.rows;
};

export const retrieveExerciseQuery = async (
  res: any,
  id: string
): Promise<Response> => {
  const accountId = res.locals.state.account.account_id;
  const query = `SELECT * FROM exercises WHERE exercise_id = $1 AND (created_by = $2 OR view = 'public')`;
  const params = [id, accountId];

  try {
    const data = await db.query(query, params);
    if (!data.rows.length) {
      return res.status(404).json({
        role: res.locals.state.account.role,
        status: 'error',
        message: 'Exercise does not exist',
        exercise: null,
      });
    }

    const exerciseId = data.rows[0].exercise_id;
    const muscleGroups = await getMuscleGroups(exerciseId);

    const exercise = {
      ...data.rows[0],
      primary: muscleGroups
        .filter((mg) => mg.muscle_group === 'primary')
        .map((mg) => {
          return {
            name: mg.muscle_group_name,
            description: mg.muscle_group_description,
            muscle_group_id: mg.muscle_group_id,
            group: mg.muscle_group,
          };
        }),
      secondary: muscleGroups
        .filter((mg) => mg.muscle_group === 'secondary')
        .map((mg) => {
          return {
            name: mg.muscle_group_name,
            description: mg.muscle_group_description,
            muscle_group_id: mg.muscle_group_id,
            group: mg.muscle_group,
          };
        }),
    };

    return res.status(200).json({
      role: res.locals.state.account.role,
      status: 'success',
      message: 'Exercise fetched successfully',
      exercise,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Database error',
      exercise: null,
    });
  }
};
