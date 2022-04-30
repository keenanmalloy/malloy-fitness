import { db } from 'config/db';

export const getMuscleGroups = async (exerciseId: string) => {
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
